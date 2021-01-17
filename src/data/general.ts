import pkg from "../../package.json";
import { parseDependency } from "../utils";

export const dependencies = Object.entries(pkg.dependencies).map(
  parseDependency
);
export const devDependencies = Object.entries(pkg.devDependencies).map(
  parseDependency
);

export const licenseURL = pkg.licenses[0].url;
export const sourceCodeURL = pkg.repository.url;
