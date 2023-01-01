import { Container } from 'noicejs';

import { RemoteModule } from '../../src/module/RemoteModule.js';

export async function createRemoteContainer() {
  const module = new RemoteModule();
  const container = Container.from(module);
  await container.configure();

  return { container, module };
}
