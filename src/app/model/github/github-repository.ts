import {GithubTeam} from './github-team';

export class GithubRepository {

  constructor(public id?: number,
              public name?: string,
              public html_url?: string,
              public default_branch?: string,
              public teams?: GithubTeam[]) {
  }

}
