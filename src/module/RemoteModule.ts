import { Gitlab } from '@gitbeaker/node';
import { Module, ModuleOptions, Provides } from 'noicejs';

import { Remote, RemoteOptions } from '../remote/index.js';
import { GithubRemote } from '../remote/github.js';
import { GitlabOptions, GitlabRemote, INJECT_GITLAB } from '../remote/gitlab.js';
import { kebabCase } from '../utils.js';

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
