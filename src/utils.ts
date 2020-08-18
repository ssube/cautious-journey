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

export function compareItems<T>(a: Array<T>, b: Array<T>): boolean {
  if (a.length !== b.length) {
    return false;
  }

  const aSorted = a.sort();
  const bSorted = b.sort();

  for (let i = 0; i < aSorted.length; ++i) {
    if (aSorted[i] !== bSorted[i]) {
      return false;
    }
  }

  return true;
}

interface Collection<T> {
  has(value: T): boolean;
}

export function contains<T>(a: Collection<T>, b: Array<T>): boolean {
  return b.every((it) => a.has(it));
}
