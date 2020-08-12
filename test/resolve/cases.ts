import { ResolveInput, ResolveResult } from '../../src/resolve';

export interface ResolveTestCase {
  input: ResolveInput;
  name: string;
  result: ResolveResult;
}

export const TEST_CASES: Array<ResolveTestCase> = [{
  input: {
    flags: [],
    labels: [],
    states: [],
  },
  name: 'empty',
  result: {
    changes: [],
    errors: [],
    labels: [],
  },
}, {
  input: {
    flags: [{
      adds: [],
      name: 'test',
      priority: 1,
      removes: [],
      requires: [],
    }],
    labels: [
      'test',
    ],
    states: [],
  },
  name: 'basic flags',
  result: {
    changes: [],
    errors: [],
    labels: [
      'test',
    ],
  },
}];
