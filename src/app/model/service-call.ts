export class ServiceCall {

  constructor(public id?: string,
              public deploymentId?: string,
              public serviceApplicationId?: string,
              public serviceDeploymentId?: string,
              public serviceName?: string,
              public serviceBaseUrl?: string) {
  }

}
