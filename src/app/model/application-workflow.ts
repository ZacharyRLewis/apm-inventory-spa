import {Application} from './application';

export class ApplicationWorkflow {

  constructor(public id?: string,
              public applicationId?: string,
              public workflowStatusId?: string,
              public applicationClass?: string,
              public repositoryName?: string,
              public repositoryTeam?: string,
              public applicationLayer?: string,
              public application?: Application) {
  }

}
