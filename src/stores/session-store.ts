import crypto from 'crypto';
import { cacheClient } from '../configs/connections.js';
const config = {
    sessionTtlMinutes: 30, // Session time-to-live in minutes
};

export interface SessionUser {
    oid: string;
    name?: string | undefined;
    preferredUsername?: string | undefined;
    tenantId?: string | undefined;
}

export interface SessionData {
    user: SessionUser;
    homeAccountId: string; // lets us call msalClient.getTokenCache() later for silent refresh
    createdAt: number;
    expiresAt: number;
}

// In-memory for local dev/demo. Swap this module's implementation for Redis
// (or your DB) in production — the interface below is intentionally small
// so that's a drop-in change; nothing else in the app needs to know.
const sessions = cacheClient; // new Map<string, SessionData>();
export async function createSession(user: SessionUser, homeAccountId: string): Promise<string> {
    const sessionId = crypto.randomUUID();
    const now = Date.now();
    await sessions.set(`session:${sessionId}`, JSON.stringify({
        user,
        homeAccountId,
        createdAt: now,
        expiresAt: now + config.sessionTtlMinutes * 60 * 1000,
    }), 'PX', config.sessionTtlMinutes * 60 * 1000);
    return sessionId;
}

export async function getSession(sessionId: string): Promise<SessionData | null> {
    const entry = await sessions.get(`session:${sessionId}`);
    if (!entry) return null;

    const sessionData = JSON.parse(entry);
    if (Date.now() > sessionData.expiresAt) {
        await sessions.del(`session:${sessionId}`);
        return null;
    }
    return sessionData;
}

export async function touchSession(sessionId: string): Promise<void> {
    const entry = await sessions.get(`session:${sessionId}`);
    if (entry) {
        const sessionData = JSON.parse(entry);
        sessionData.expiresAt = Date.now() + config.sessionTtlMinutes * 60 * 1000;
        await sessions.set(`session:${sessionId}`, JSON.stringify(sessionData), 'PX', config.sessionTtlMinutes * 60 * 1000);
    }
}

export async function destroySession(sessionId: string): Promise<void> {
    await sessions.del(`session:${sessionId}`);
}

// // Periodic sweep of expired sessions
// setInterval(() => {
//     const now = Date.now();
//     for (const [id, entry] of sessions) {
//         if (now > entry.expiresAt) sessions.delete(id);
//     }
// }, 5 * 60 * 1000).unref();