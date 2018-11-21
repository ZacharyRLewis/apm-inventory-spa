import {ApplicationType} from './application-type';
import {Deployment} from './deployment';
import {Dependency} from './dependency';

export class Application {

  constructor(public id?: string,
              public name?: string,
              public mnemonic?: string,
              public description?: string,
              public serviceApi?: boolean,
              public applicationType?: ApplicationType,
              public deployments?: Deployment[],
              public dependencies?: Dependency[]) {
  }

}
