import { ResolveInput, ResolveResult } from '../../src/resolve';

export interface ResolveTestCase {
  input: ResolveInput;
  name: string;
  result: ResolveResult;
}

export const TEST_CASES: Array<ResolveTestCase> = [{
  input: {
    config: {
      colors: [],
      flags: [],
      states: [],
    },
    issue: '',
    labels: [],
  },
  name: 'test-1',
  result: {
    changes: [],
    errors: [],
    labels: [],
  },
}];
