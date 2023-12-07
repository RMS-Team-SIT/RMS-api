import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  const { method, url, headers, body } = req;
  console.log(`Request ${method} ${url}`);
  // console.log('Headers:');
  // console.log(headers);

  // if (body) {
  //   console.log('Body:');
  //   console.log(body);
  // }
  next();
}
