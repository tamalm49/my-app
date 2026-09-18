// import crypto from 'node:crypto';
import { CryptoProvider } from '@azure/msal-node'

const cryptoProvider = new CryptoProvider();

// function base64UrlEncode(buffer: Buffer): string {
//     return buffer
//         .toString('base64')
//         .replace(/\+/g, '-')
//         .replace(/\//g, '_')
//         .replace(/=+$/, '');
// }

export interface PkcePair {
    verifier: string;
    challenge: string;
}

/**
 * Generates an RFC 7636 PKCE verifier/challenge pair (S256 method).
 * Even though this is a confidential client (we also hold a client secret),
 * adding PKCE gives defense-in-depth against authorization-code interception.
 */
export async function generatePkce(): Promise<PkcePair> {
    // const verifier = base64UrlEncode(crypto.randomBytes(32)); // 43 chars, within 43-128 spec range
    // const challenge = base64UrlEncode(crypto.createHash('sha256').update(verifier).digest());
    // return { verifier, challenge };
    const { verifier, challenge } = await cryptoProvider.generatePkceCodes();
    return { verifier, challenge };
}

export async function generateState(): Promise<string> {
    return cryptoProvider.createNewGuid();
}