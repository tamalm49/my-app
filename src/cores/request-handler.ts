import type { RequestHandler } from 'express';
import { logger } from '../utils/logger.js';

export const asyncHandler = (handler: RequestHandler): RequestHandler => {
    return async (req, res, next) => {
        try {
            logger.info(
                {
                    requestId: getRequestId(),
                    userId: getUserId(),
                    method: req.method,
                    url: req.originalUrl,
                },
                'Request received',
            );
            await handler(req, res, next);
        } catch (error) {
            next(error);
        }
    }
};