import type { Request, Response } from "express";
import * as fs from "fs";
import glob from "glob";
import * as path from "path";

const exampleConfigurations = glob
  .sync(path.join("example-configurations", "*.json"))
  .map((filePath) => JSON.parse(fs.readFileSync(filePath).toString()));

export async function get(req: Request, res: Response): Promise<void> {
  res.send(exampleConfigurations);
}
