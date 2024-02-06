// auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

export const authorizeUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user.id;
  if (userId !== req.params.id) {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
  next();
};
