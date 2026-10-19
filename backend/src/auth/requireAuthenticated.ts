import type { Request } from 'express';
import { AppError } from '../utils/AppError.js';

type AuthUser = {
    id: number;
    username: string;
    email: string;
};

export function requireAuthenticatedUser( req: Request): AuthUser {
    if (!req.user) {
        throw new AppError(
            'Authentication required',
            401
        );
    }

    return req.user;
}