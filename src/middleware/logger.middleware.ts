import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`datetime : ${Date.now()} req:`, {
    headers: req.headers,
    body: req.body,
    originalUrl: req.originalUrl,
    method: req.method,
    params: req.params,
    query: req.query,
  });
  console.log(`----------------------------------------`);
  
  next();
}
