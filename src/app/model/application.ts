import {ApplicationType} from './application-type';
import {ComputeEnvironment} from './compute-environment';
import {Dependency} from './dependency';

export class Application {

  constructor(public id?: string,
              public name?: string,
              public mnemonic?: string,
              public description?: string,
              public applicationType?: ApplicationType,
              public computeEnvironments?: ComputeEnvironment[],
              public dependencies?: Dependency[]) {
  }

}
