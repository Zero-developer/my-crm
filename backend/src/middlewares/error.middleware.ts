import { type NextFunction, type Request, type Response } from 'express';
import { z } from 'zod'
import { AppError } from '../utils/AppError.js';
import { Prisma } from '../../generated/prisma/client.js';

export function errorMiddleware(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {

  console.error(error);

  if (error instanceof z.ZodError) {
    return res.status(400).json({
      message: 'Validation Error',
      error: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message
      }))
    })
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message
    })
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: 'Resource not found'
      })
    }
  }

  res.status(500).json({
    message: 'Internal server error'
  });
}