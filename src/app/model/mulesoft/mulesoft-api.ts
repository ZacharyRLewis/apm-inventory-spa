export class MulesoftApi {

  constructor(public id?: number,
              public createdDate?: string,
              public updatedDate?: string,
              public organizationId?: string,
              public environmentId?: string,
              public groupId?: string,
              public assetId?: string,
              public assetVersion?: string,
              public productVersion?: string,
              public implementationUrl?: string,
              public deploymentName?: string,
              public deploymentEnvironment?: string,
              public deploymentTarget?: string,
              public deprecated?: boolean,
              public isPublic?: boolean) {
  }

}
