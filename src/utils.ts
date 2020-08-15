import { doesExist, Optional, mustExist } from '@apextoaster/js-utils';

export function defaultTo<T>(a: Optional<T>, b: T): T {
  if (doesExist(a)) {
    return a;
  } else {
    return b;
  }
}

export function defaultUntil<T>(...items: Array<Optional<T>>): T {
  const result = items.reduce(defaultTo, undefined);
  return mustExist(result);
}

export function randomItem<T>(items: Array<T>, source = Math.random): T {
  const idx = Math.floor(source() * items.length);
  return items[idx];
}
