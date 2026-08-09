import { randomUUID } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import { RequestContextStore } from '../cores/request-context.js';

export function requestContext(req: Request, res: Response, next: NextFunction) {
  const requestId = req.headers['x-request-id']?.toString() ?? randomUUID();
  RequestContextStore.run({ requestId, userId: null }, () => {
    res.setHeader('x-request-id', requestId);
    next();
  });
}
