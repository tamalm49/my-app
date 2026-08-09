import type { Request, Response, NextFunction } from 'express';

export function notFoundHandler(req: Request, res: Response, _next: NextFunction) {
  if (req.accepts('html')) {
    return res.status(404).render('not-found-page');
  }

  return res.status(404).json({
    success: false,
    message: 'Not Found',
    status: 404
  });
}
