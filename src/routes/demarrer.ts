import type { Request, Response, NextFunction } from 'express';
import { CookieKeys } from '../types/cookie-keys';

export async function get(req: Request, res: Response, next: NextFunction) {
  res.cookie(CookieKeys.IntroCompleted, JSON.stringify(true));
  res.redirect('/');
}
