import { doesExist, mustExist, Optional } from '@apextoaster/js-utils';
import { prng } from 'seedrandom';

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

export function randomItem<T>(items: Array<T>, source: prng): T {
  const idx = Math.abs(source.int32()) % items.length;
  return items[idx];
}
