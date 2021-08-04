import { Gitlab } from '@gitbeaker/node';
import { Module, ModuleOptions, Provides } from 'noicejs';

import { Remote, RemoteOptions } from '../remote';
import { GithubRemote } from '../remote/github';
import { GitlabOptions, GitlabRemote, INJECT_GITLAB } from '../remote/gitlab';
import { kebabCase } from '../utils';

export class RemoteModule extends Module {
  public async configure(options: ModuleOptions) {
    await super.configure(options);

    this.bind<Remote, GithubRemote, RemoteOptions>(kebabCase(GithubRemote.name)).toConstructor(GithubRemote);
    this.bind<Remote, GitlabRemote, RemoteOptions>(kebabCase(GitlabRemote.name)).toConstructor(GitlabRemote);
  }

  @Provides(INJECT_GITLAB)
  public async createGitlab(options: GitlabOptions) {
    return new Gitlab({
      host: options.host,
      token: options.token,
    });
  }
}
