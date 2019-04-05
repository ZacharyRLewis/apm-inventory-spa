import {Dependency} from './dependency';
import {Deployment} from './deployment';

export class Application {

  constructor(public id?: string,
              public name?: string,
              public mnemonic?: string,
              public description?: string,
              public repository?: string,
              public defaultBranch?: string,
              public serviceApi?: boolean,
              public applicationTypeId?: string,
              // public applicationType?: ApplicationType,
              public deployments?: Deployment[],
              public dependencies?: Dependency[]) {
  }

}
