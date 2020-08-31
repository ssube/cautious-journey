import { ResolveInput, ResolveResult } from '../../src/resolve';
import { StateLabel, FlagLabel } from '../../src';

export interface ResolveTestCase {
  input: ResolveInput;
  name: string;
  result: Partial<ResolveResult>;
}

export const TWO_STATE_CYCLE: StateLabel = {
  adds: [],
  divider: '/',
  name: 'foo',
  priority: 1,
  removes: [],
  requires: [],
  values: [{
    adds: [{
      name: 'fin',
    }],
    becomes: [{
      adds: [{
        name: 'foo/bin',
      }],
      matches: [{
        name: 'next',
      }],
      removes: [],
    }],
    name: 'bar',
    priority: 1,
    removes: [{
      name: 'bob',
    }],
    requires: [],
  }, {
    adds: [],
    becomes: [{
      adds: [{
        name: 'foo/bar',
      }],
      matches: [{
        name: 'next',
      }],
      removes: [],
    }],
    name: 'bin',
    priority: 1,
    removes: [{
      name: 'bob',
    }],
    requires: [],
  }],
};

export const SECOND_STATE_FALLBACK: StateLabel = {
  adds: [],
  divider: '/',
  name: 'foo',
  priority: 1,
  removes: [],
  requires: [],
  values: [{
    adds: [],
    becomes: [{
      adds: [{
        name: 'fin',
      }],
      matches: [{
        name: 'next',
      }],
      removes: [],
    }],
    name: 'bar',
    priority: 1,
    removes: [],
    requires: [{
      name: 'bob',
    }],
  }, {
    adds: [],
    becomes: [{
      adds: [],
      matches: [{
        name: 'next',
      }],
      removes: [],
    }],
    name: 'bin',
    priority: 1,
    removes: [],
    requires: [],
  }],
};

const SIMPLE_FLAG: FlagLabel = {
  adds: [],
  name: 'test',
  priority: 1,
  removes: [],
  requires: [],
};

const DEPENDENT_FLAG: FlagLabel = {
  adds: [],
  name: 'bar',
  priority: 1,
  removes: [],
  requires: [{
    name: 'test',
  }],
};

export const TEST_CASES: Array<ResolveTestCase> = [{
  input: {
    flags: [],
    initial: [],
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
    flags: [SIMPLE_FLAG],
    initial: [],
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
}, {
  input: {
    flags: [],
    initial: [],
    labels: ['foo/bar', 'next'],
    states: [TWO_STATE_CYCLE],
  },
  name: 'become adds',
  result: {
    errors: [],
    labels: ['fin', 'foo/bin'],
  },
}, {
  input: {
    flags: [],
    initial: [],
    labels: ['foo/bar', 'next', 'bob'],
    states: [TWO_STATE_CYCLE],
  },
  name: 'become removes',
  result: {
    errors: [],
    labels: ['fin', 'foo/bin'],
  },
}, {
  input: {
    flags: [],
    initial: [],
    labels: ['foo/bar', 'foo/bin'],
    states: [TWO_STATE_CYCLE],
  },
  name: 'state single value',
  result: {
    errors: [],
    labels: ['fin', 'foo/bar'],
  },
}, {
  input: {
    flags: [],
    initial: [],
    labels: ['foo/bar', 'foo/bin'],
    states: [SECOND_STATE_FALLBACK],
  },
  name: 'second state requires missing',
  result: {
    errors: [],
    labels: ['foo/bin'],
  },
}, {
  input: {
    flags: [],
    initial: [],
    labels: ['foo/bar', 'foo/bin', 'bob'],
    states: [SECOND_STATE_FALLBACK],
  },
  name: 'second state requires present (skip first)',
  result: {
    errors: [],
    labels: ['bob', 'foo/bar'],
  },
}, {
  input: {
    flags: [],
    initial: [],
    labels: ['foo/bin', 'bob'],
    states: [SECOND_STATE_FALLBACK],
  },
  name: 'second state requires present (second only)',
  result: {
    errors: [],
    labels: ['bob', 'foo/bin'],
  },
}, {
  input: {
    flags: [DEPENDENT_FLAG],
    initial: [],
    labels: ['test', 'bar'],
    states: [],
  },
  name: 'dependent flag requires present',
  result: {
    errors: [],
    labels: ['bar', 'test'],
  },
}, {
  input: {
    flags: [DEPENDENT_FLAG],
    initial: [],
    labels: ['bar'],
    states: [],
  },
  name: 'dependent flag requires missing',
  result: {
    errors: [],
    labels: [],
  },
}, {
  input: {
    flags: [DEPENDENT_FLAG, SIMPLE_FLAG],
    initial: [],
    labels: [],
    states: [TWO_STATE_CYCLE, SECOND_STATE_FALLBACK],
  },
  name: 'empty set',
  result: {
    changes: [],
    errors: [],
    labels: [],
  },
}];
