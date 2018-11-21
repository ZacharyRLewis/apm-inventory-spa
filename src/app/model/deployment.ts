import {Database} from './database';
import {ServiceCall} from './service-call';

export class Deployment {

  constructor(public id?: string,
              public applicationId?: string,
              public environment?: string,
              public hostServer?: string,
              public directory?: string,
              public contextName?: string,
              public port?: string,
              public https?: boolean,
              public databases?: Database[],
              public services?: ServiceCall[]) {
  }

  public static getBaseUrl(deployment: Deployment): string {
    return (deployment.https ? 'https://' : 'http://') + deployment.hostServer + ':' + deployment.port + '/' + deployment.contextName;
  }
}
