import type { Request, Response, NextFunction } from 'express';
import { RequestContextStore } from '../cores/request-context.js';

export function authenticate(_req: Request,_res: Response,next: NextFunction) {
  // Decode JWT...
  const userId = "12345";

  RequestContextStore.setUserId(userId);

  next();
}