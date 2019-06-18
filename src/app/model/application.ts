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
              public owningDepartment?: string,
              public primaryContactName?: string,
              public primaryContactEmail?: string,
              public primaryContactPhone?: string,
              public tags?: string[],
              public owners?: string[],
              public deployments?: Deployment[],
              public dependencies?: Dependency[]) {
  }

}
