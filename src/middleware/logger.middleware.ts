import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  const { method, url } = req;
  if (process.env.SHOW_LOG === 'true')
    console.log(`Request ${method} ${url}`);
  next();
}
