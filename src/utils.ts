import { doesExist, Optional } from '@apextoaster/js-utils';

export function defaultTo<T>(a: Optional<T>, b: T): T {
  if (doesExist(a)) {
    return a;
  } else {
    return b;
  }
}
