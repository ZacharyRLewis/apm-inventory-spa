import {DatabaseType} from './database-type';

export class Database {

  constructor(public id?: number,
              public name?: string,
              public hostName?: string,
              public port?: string,
              public type?: DatabaseType,
              public environment?: string) {
  }

}
