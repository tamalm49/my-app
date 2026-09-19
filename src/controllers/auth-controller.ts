import { azureEndpoints, config } from "../configs/azureMsal.js";
import { asyncHandler } from "../cores/request-handler.js";
import { consumePkceTransactionFromRedis, savePkceTransactionToRedis, } from "../stores/pkce-store.js";
import { createSession, destroySession, type SessionUser } from "../stores/session-store.js";
import { loginScopes, msalClient } from "../utils/msal-client .js";
import { generatePkce, generateState } from "../utils/pkce.js";
import { SESSION_COOKIE_NAME } from "../middlewares/authenticator.js";
const cookieOptions = {
    httpOnly: true,
    secure: config.cookieSecure, // set true in prod (requires HTTPS)
    sameSite: 'lax' as const, // 'lax' survives the top-level redirect back from Azure AD
    // signed: true,
    maxAge: config.sessionTtlMinutes * 60 * 1000,
};
export const login = asyncHandler(async (_req, res) => {
    const { verifier, challenge } = await generatePkce();
    const state = await generateState();
    await savePkceTransactionToRedis(state, verifier);

    const authUrl = await msalClient.getAuthCodeUrl({
        scopes: loginScopes,
        redirectUri: config.redirectUri,
        state,
        codeChallenge: challenge,
        codeChallengeMethod: 'S256',
    });

    res.redirect(authUrl);
})
// eslint-disable-next-line consistent-return
export const callbackHandler = asyncHandler(async (req, res) => {
    const { code, state, error, error_description } = req.query as Record<string, string>;

    if (error) {
        return res.status(400).send(`Login failed: ${error} - ${error_description ?? ''}`);
    }
    if (!code || !state) {
        return res.status(400).send('Missing code or state in callback');
    }

    const codeVerifier = await consumePkceTransactionFromRedis(state);
    if (!codeVerifier) {
        return res.status(400).send('Invalid or expired login attempt. Please try signing in again.');
    }

    const result = await msalClient.acquireTokenByCode({
        code,
        scopes: loginScopes,
        redirectUri: config.redirectUri,
        codeVerifier,
    });

    if (!result?.account) {
        return res.status(500).send('Login succeeded but no account info was returned');
    }

    const claims = result.account.idTokenClaims as Record<string, unknown> | undefined;

    const user: SessionUser = {
        oid: result.account.homeAccountId,
        name: result.account.name,
        preferredUsername: result.account.username,
        tenantId: (claims?.tid as string) ?? result.account.tenantId,
    };

    // Azure AD has confirmed WHO this is; this is the separate check for
    // WHETHER they're allowed to use the app. Nothing is stored/cookied
    // for a rejected user.
    // if (!isUserAllowed(user.preferredUsername)) {
    //     return res.status(403).send(`
    //     <h1>Access denied</h1>
    //     <p>${user.preferredUsername ?? 'This account'} is signed in with Azure AD but is not
    //     on the allowlist for this application. Contact an administrator to request access.</p>
    //   `);
    // }

    const sessionId = await createSession(user, result.account.homeAccountId);

    res.cookie(SESSION_COOKIE_NAME, sessionId, cookieOptions);
    res.redirect('/dashboard');
})
export const logout = asyncHandler(async (req, res) => {
    const sessionId = req.cookies[SESSION_COOKIE_NAME];
    if (sessionId) {
        await destroySession(sessionId);
    }
    res.clearCookie(SESSION_COOKIE_NAME, cookieOptions);
    const logoutUrl = `${azureEndpoints.logoutUrl}?post_logout_redirect_uri=${encodeURIComponent(config.postLogoutRedirectUri)}`;
    res.redirect(logoutUrl);
})