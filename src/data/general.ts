import { parseDependency } from '../utils';

import pkg from '../../package.json';

export const dependencies = Object.entries(pkg.dependencies).map(
  parseDependency,
);
export const devDependencies = Object.entries(pkg.devDependencies).map(
  parseDependency,
);

export const licenseURL = `${pkg.repository.url}/blob/master/LICENSE`;
export const sourceCodeURL = pkg.repository.url;
