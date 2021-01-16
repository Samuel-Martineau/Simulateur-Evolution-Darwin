import { parseDependency } from '../utils';
import pkg from '../../package.json';

export const dependencies = Object.entries(pkg.dependencies).map(
  parseDependency,
);
export const devDependencies = Object.entries(pkg.devDependencies).map(
  parseDependency,
);

export const licenseURL = pkg.licenses[0].url;
export const sourceCodeURL = pkg.repository.url;
