import type { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../cores/response-handler.js';
export const healthCheck = (_req: Request, res: Response, _next: NextFunction) => {
  return sendSuccess(res, null, 'Service is healthy');
};
