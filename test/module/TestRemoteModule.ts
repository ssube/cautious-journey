import { Gitlab } from '@gitbeaker/node';
import { expect } from 'chai';
import { Container } from 'noicejs';

import { RemoteModule } from '../../src/module/RemoteModule';
import { INJECT_GITLAB } from '../../src/remote/gitlab';

describe('remote module', async () => {
  it('should create a Gitlab client', async () => {
    const module = new RemoteModule();
    const container = Container.from(module);
    await container.configure();

    const client = await container.create(INJECT_GITLAB);
    expect(client).to.be.an.instanceOf(Gitlab);
  });
});
