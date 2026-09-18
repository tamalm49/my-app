import { rateLimit } from 'express-rate-limit';
import { RedisStore, type RedisReply } from 'rate-limit-redis';
import { cacheClient } from '../configs/connections.js';
import type { ApiErrorResponse } from '../cores/response-handler.js';
import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } from '../constants/http-status.js';

const message: ApiErrorResponse = {
  success: false,
  data: null,
  message: HTTP_STATUS_MESSAGES.TOO_MANY_REQUESTS,
  error: {
    code: HTTP_STATUS_CODES.TOO_MANY_REQUESTS,
    message: HTTP_STATUS_MESSAGES.TOO_MANY_REQUESTS,
  },
};
const store = new RedisStore({
  sendCommand: (command: string, ...args: string[]) => cacheClient.call(command, ...args) as Promise<RedisReply>,
  prefix: 'rate-limit:',
});
export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 10, // Limit each IP to 10 requests per `window` (here, per 1 minute).
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  store: store,
  message
});
