import type { Request, Response, NextFunction } from 'express';
export const healthCheck = (_req: Request, res: Response, _next: NextFunction) => {
  res.status(200).json({ userId: getUserId(), requestId: getRequestId(), status: 'ok' });
};
