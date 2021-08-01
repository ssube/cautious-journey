import { doesExist, mustExist, Optional } from '@apextoaster/js-utils';

export interface RandomGenerator {
  double(): number;
  int32(): number;
}

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

export function randomItem<T>(items: Array<T>, source: RandomGenerator): T {
  const idx = Math.abs(source.int32()) % items.length;
  return items[idx];
}

export function compareItems<T>(a: Array<T>, b: Array<T>): boolean {
  if (a.length !== b.length) {
    return false;
  }

  const aSorted = Array.from(a);
  aSorted.sort();
  const bSorted = Array.from(b);
  bSorted.sort();

  for (let i = 0; i < aSorted.length; ++i) {
    if (aSorted[i] !== bSorted[i]) {
      return false;
    }
  }

  return true;
}

export function kebabCase(name: string): string {
  return name
    .replace(/([A-Z])/g, (m: string, p1: string) => `-${p1.toLocaleLowerCase()}`) // capitals
    .replace(/[^-a-z0-9]/g, '-') // non-alnum
    .replace(/--+/g, '-') // duplicates
    .replace(/(^-|-$)/g, ''); // leading/trailing
}
