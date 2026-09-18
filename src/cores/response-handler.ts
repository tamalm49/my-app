import type { Response } from "express";
import { HTTP_STATUS, HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } from "../constants/http-status.js"
export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
    message?: string;
    error: null;
}

export interface ApiErrorResponse {
    success: false;
    data: null;
    message: string;
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
}

export type ApiResponse<T> =
    | ApiSuccessResponse<T>
    | ApiErrorResponse;

export function sendSuccess<T>(
    res: Response,
    data: T,
    message = HTTP_STATUS_MESSAGES.OK,
    statusCode = HTTP_STATUS.OK,
    code = HTTP_STATUS_CODES.OK
) {
    return res.status(statusCode).json({
        success: true,
        code,
        data,
        message,
        error: null,
    });
}

export function sendError(
    res: Response,
    statusCode: number = HTTP_STATUS.Internal_Server_Error,
    message: string = HTTP_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
    code: string = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
    details?: unknown,
) {
    return res.status(statusCode).json({
        success: false,
        code,
        data: null,
        message,
        error: {
            code,
            ...(details !== undefined && { details }),
        },
    });
}