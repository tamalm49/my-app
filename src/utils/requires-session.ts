import type { Request, Response, NextFunction } from 'express';
import { getSession, touchSession, type SessionUser } from '../stores/session-store.js';

const SESSION_COOKIE_NAME = 'sid';

export interface SessionRequest extends Request {
    user?: SessionUser;
    sessionId?: string;
}

function wantsHtml(req: Request): boolean {
    return req.headers.accept?.includes('text/html') ?? false;
}

// eslint-disable-next-line consistent-return
export async function requireSession(req: SessionRequest, res: Response, next: NextFunction) {
    console.log('requireSession called', req.cookies, req.headers.accept);
    const sessionId = req.cookies?.sid

    if (!sessionId) {
        if (wantsHtml(req)) return res.redirect('/api/auth/login');
        return res.status(401).json({ error: 'Not signed in' });
    }

    const session = await getSession(sessionId);
    if (!session) {
        res.clearCookie(SESSION_COOKIE_NAME);
        if (wantsHtml(req)) return res.redirect('/api/auth/login');
        return res.status(401).json({ error: 'Session expired or invalid' });
    }

    await touchSession(sessionId); // sliding expiration
    req.user = session.user;
    req.sessionId = sessionId;
    next();
}

export { SESSION_COOKIE_NAME };