
import type { Request, Response, NextFunction } from 'express';
import { type JwtPayload } from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import { verifyToken } from '../utils/jwt.js';

export type AuthenticatedUser = {
    id: number;
    username: string;
    email: string;
};

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}

export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authorization = req.headers.authorization;

    // 1. Comprobar que exista el header Bearer
    if (!authorization?.startsWith('Bearer ')) {
        return next(
            new AppError('Authentication required', 401)
        );
    }

    const token = authorization.slice(7).trim();

    if (!token) {
        return next(
            new AppError('Authentication required', 401)
        );
    }

    // 2. Verificar la firma y expiración del JWT
    let decoded: string | JwtPayload;

    try {
        decoded = verifyToken(token);
    } catch {
        return next(
            new AppError('Invalid or expired access token', 401)
        );
    }

    // 3. Comprobar que el payload tenga los datos esperados
    if (
        typeof decoded === 'string' ||
        typeof decoded.id !== 'number' ||
        typeof decoded.username !== 'string' ||
        typeof decoded.email !== 'string'
    ) {
        return next(
            new AppError('Invalid access token payload', 401)
        );
    }

    // 4. Adjuntar la identidad validada a la petición
    req.user = {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email
    };

    // 5. Continuar hacia el siguiente middleware o controlador
    return next();
}

