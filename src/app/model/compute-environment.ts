import {Database} from './database';

export class ComputeEnvironment {

  constructor(public environment: string,
              public hostServer: string,
              public directory: string,
              public port: string,
              public databases: Database[]) {
  }

}
