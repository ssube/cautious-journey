import { expect } from 'chai';

import { BunyanLogger } from '../../src/logger/bunyan';

describe('bunyan logger', async () => {
  it('should create a logger', async () => {
    const logger = BunyanLogger.create({
      name: 'test-logger',
    });
    expect(logger).to.have.property('debug').which.is.an.instanceOf(Function);
    expect(logger).to.have.property('error').which.is.an.instanceOf(Function);
    expect(logger).to.have.property('info').which.is.an.instanceOf(Function);
    expect(logger).to.have.property('warn').which.is.an.instanceOf(Function);
  });
});
