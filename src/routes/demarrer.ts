import type { Request, Response } from "express";

import { CookieKeys } from "../types/cookie-keys";

export async function get(req: Request, res: Response): Promise<void> {
  res.cookie(CookieKeys.IntroCompleted, JSON.stringify(true));
  res.redirect("/");
}
