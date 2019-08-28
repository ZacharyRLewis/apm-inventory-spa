import {GithubTeam} from './github/github-team';

export class ApplicationWorkflowQuestions {

  constructor(public repoExists?: string,
              public needsRepo?: string,
              public repoName?: string,
              public githubTeam?: GithubTeam,
              public archEngaged?: string,
              public architectRep?: string) {
  }

}
