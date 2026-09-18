import { ConfidentialClientApplication, LogLevel } from '@azure/msal-node';
import { azureEndpoints, config } from '../configs/azureMsal.js';

export const msalClient = new ConfidentialClientApplication({
    auth: {
        clientId: config.clientId,
        authority: azureEndpoints.authority, // single-tenant
        clientSecret: config.clientSecret,
    },
    system: {
        loggerOptions: {
            loggerCallback(level, message, containsPii) {
                if (containsPii) return;
                if (level === LogLevel.Error) console.error('[msal]', message);
            },
            logLevel: LogLevel.Warning,
        },
    },
});

// Scopes requested from Azure AD for the sign-in itself. Add Graph scopes
// here (e.g. 'User.Read') only if this backend will call Graph on the
// user's behalf; if it's just establishing identity, openid/profile suffice.
export const loginScopes = ['openid', 'profile', 'offline_access', 'User.Read'];