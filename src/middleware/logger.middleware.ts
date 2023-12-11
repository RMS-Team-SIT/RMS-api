import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  const { method, url } = req;
  console.log(`Request ${method} ${url}`);
  next();
}
