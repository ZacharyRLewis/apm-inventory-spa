import {Database} from './database';
import {ServiceCall} from './service-call';

export class Deployment {

  constructor(public id?: string,
              public applicationId?: string,
              public environment?: string,
              public hostServerId?: string,
              public directory?: string,
              public contextName?: string,
              public port?: string,
              public https?: boolean,
              public databases?: Database[],
              public services?: ServiceCall[]) {
  }

  public static getBaseUrl(deployment: Deployment, hostServerName: string): string {
    const protocol: string = deployment.https && deployment.https === true ? 'https://' : 'http://';
    const port: string = deployment.port ? ':' + deployment.port : '';

    return protocol + hostServerName + port + '/' + deployment.contextName;
  }
}
