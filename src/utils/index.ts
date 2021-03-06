import _ from "lodash";
import type { DeepPartial } from "tsdef";
import { v4 as uuidv4 } from "uuid";

import type { Dependency } from "../types/dependency";
import type { SimulatorConfiguration } from "../types/simulator-configuration";
import type { V1SimulatorConfiguration } from "../types/v1-simulator-configuration";
import { baseConfiguration } from "./base-configuration";

export const getRandomSeed = (): number => Math.round(Math.random() * 100_000);

export const isV2SimulatorConfiguration = (
  configuration: SimulatorConfiguration | V1SimulatorConfiguration
): configuration is SimulatorConfiguration =>
  (configuration as any).version === "2";

export const generateBaseConfiguration = (): SimulatorConfiguration =>
  _.defaultsDeep(
    { id: uuidv4(), title: "Nouvelle configuration", seed: getRandomSeed() },
    baseConfiguration
  );

export function applyDefaultsDeep<T>(
  obj: DeepPartial<T> & { [key: string]: any },
  src: T
): T {
  return _.pick(
    _.assignInWith(obj, src, (objValue, srcValue) => {
      if (_.isObject(objValue) && _.isObject(srcValue))
        return applyDefaultsDeep(objValue, srcValue);
      if (!_.isObject(objValue) && _.isObject(srcValue)) return srcValue;
      else if (_.isUndefined(objValue) || _.isNull(objValue)) return srcValue;
      else if (typeof objValue !== typeof srcValue) return srcValue;
      else return objValue;
    }),
    _.keys(src)
  ) as T;
}

export function toFactory<T extends (...args: any[]) => any>(
  func: T,
  ...args: Parameters<T>
): () => ReturnType<T> {
  return () => func(...args);
}

export function parseDependency([name, versionRange]: [
  string,
  string
]): Dependency {
  return {
    name,
    version: versionRange.replace(/^(\^|~)/, ""),
    url: `https://npmjs.com/package/${name}/v/${versionRange.slice(1)}`,
  };
}

export function scrollIntoView(
  selector: string,
  container: HTMLElement | Window,
  offset: number
): void {
  const element = document.querySelector(selector) as HTMLElement;
  if (!element) throw new Error(`Element "${element}" doesn't exist`);

  setTimeout(() =>
    container.scrollBy({ top: element.getBoundingClientRect().top - offset })
  );
}

export const pluralize = (str: string, condition: boolean, end = "s"): string =>
  str + (condition ? end : "");
export const titleize = (str: string): string =>
  str[0].toUpperCase() + str.slice(1);

export { transpileV1ConfigurationToV2 } from "./transpile-v1-configuration-to-v2";
export { transpileV2ConfigurationToV1 } from "./transpile-v2-configuration-to-v1";
