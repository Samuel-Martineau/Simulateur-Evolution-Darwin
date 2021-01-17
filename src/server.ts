import sirv from 'sirv';
import express, { Request, Response } from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';
import cookieParser from 'cookie-parser';
import { CookieKeys } from './types/cookie-keys';
import isMobile from 'is-mobile';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const app = express();

app.use(
  compression({ threshold: 0 }),
  sirv('static', { dev }),
  cookieParser(),
  sapper.middleware({
    session: (req: Request, res: Response) => ({
      isMobileUA: isMobile({
        ua: req.get('User-Agent'),
      }),
      mobileOverride: JSON.parse(
        req.cookies[CookieKeys.MobileOverride] || 'false',
      ),
      introCompleted: JSON.parse(
        req.cookies[CookieKeys.IntroCompleted] || 'false',
      ),
    }),
  }),
);

app.listen(PORT);
