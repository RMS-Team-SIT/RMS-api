import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`----------------------------------------`);
  const { method, url, headers, body } = req;

  console.log(`Request ${method} ${url}`);
  console.log('Headers:');
  console.log(headers);

  if (body) {
    console.log('Body:');
    console.log(body);
  }
  console.log(`----------------------------------------`);
  next();
}
