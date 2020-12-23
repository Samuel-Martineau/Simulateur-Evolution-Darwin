import type { Request, Response, NextFunction } from 'express';
import { CookieKeys } from '../../types/cookie-keys';
import ms from 'ms';

export async function get(req: Request, res: Response, next: NextFunction) {
  res.cookie(CookieKeys.MobileOverride, JSON.stringify(true), {
    expires: new Date(Date.now() + ms('2 days')),
  });
  res.redirect('/');
}
