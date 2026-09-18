function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required env var: ${name}`);
    }
    return value;
}

export const config = {
    tenantId: required('AZURE_TENANT_ID'),
    clientId: required('AZURE_CLIENT_ID'),
    clientSecret: required('AZURE_CLIENT_SECRET'),
    redirectUri: required('AZURE_REDIRECT_URI'),
    postLogoutRedirectUri: process.env.AZURE_POST_LOGOUT_REDIRECT_URI ?? 'http://localhost:3000/',
    cookieSecret: process.env.COOKIE_SECRET ?? 'dev-secret-change-me',
    cookieSecure: process.env.COOKIE_SECURE === 'true',
    sessionTtlMinutes: Number(process.env.SESSION_TTL_MINUTES ?? 60),
};

export const azureEndpoints = {
    authority: `https://login.microsoftonline.com/${config.tenantId}`,
    logoutUrl: `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/logout`,
};