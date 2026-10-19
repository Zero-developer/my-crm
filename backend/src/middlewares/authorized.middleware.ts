import type { Request, Response, NextFunction } from 'express';

export function requireAuthenticatedUserMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (!req.user) {
        res.status(401).json({
            message: 'Authentication required'
        });
        return;
    }

    next();
}