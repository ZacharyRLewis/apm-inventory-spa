import {Database} from './database';
import {Deployment} from './deployment';

export class DeploymentDatabase {

  constructor(public id?: string,
              public deploymentId?: string,
              public databaseId?: string,
              public connectionUsername?: string,
              public deployment?: Deployment,
              public database?: Database) {
  }
}
