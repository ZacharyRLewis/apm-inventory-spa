import {Application} from './application';
import {Dependency} from './dependency';

export class ApplicationDependency {

  constructor(public id?: string,
              public applicationId?: string,
              public dependencyId?: string,
              public application?: Application,
              public dependency?: Dependency) {
  }
}
