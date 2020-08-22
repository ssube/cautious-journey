import { Module, ModuleOptions } from 'noicejs';

import { Remote, RemoteOptions } from '../remote';
import { GithubRemote } from '../remote/github';
import { GitlabRemote } from '../remote/gitlab';
import { kebabCase } from '../utils';

export class RemoteModule extends Module {
  public async configure(options: ModuleOptions) {
    await super.configure(options);

    this.bind<Remote, GithubRemote, RemoteOptions>(kebabCase(GithubRemote.name)).toConstructor(GithubRemote);
    this.bind<Remote, GitlabRemote, RemoteOptions>(kebabCase(GitlabRemote.name)).toConstructor(GitlabRemote);
  }
}
