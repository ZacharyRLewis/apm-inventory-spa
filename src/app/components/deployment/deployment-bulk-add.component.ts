import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Application, Deployment, HostServer} from '../../model';

@Component({
  selector: 'apm-deployment-bulk-add',
  templateUrl: './deployment-bulk-add.component.html',
  styleUrls: ['./deployment-bulk-add.component.scss']
})
export class DeploymentBulkAddComponent {

  @Input() modalId: string;
  @Input() hostServers: HostServer[] = [];
  @Output() createAppDeploymentEvent: EventEmitter<object> = new EventEmitter<object>();
  @Output() cancelAppDeploymentEvent: EventEmitter<Application> = new EventEmitter<Application>();

  public deployments: Deployment[] = [];
  public model: Deployment = new Deployment();
  public passedApplication: Application;
  public environments: string[] = ['DEV', 'QA', 'PROD'];

  @ViewChild('newDeploymentForm')
  public newDeploymentForm;

  constructor() {
    this.setDefaultValues();
  }

  public setDefaultValues(): void {
    this.passedApplication = new Application();
    this.passedApplication.id = '';
    this.deployments = [];
    this.model.directory = '';
    this.model.environment = '';
    this.model.https = false;
    this.model.hostServerId = '';
    this.model.port = '';
    this.model.contextName = '';
  }

  public closeModal(): void {
    this.backToApplication();
    this.newDeploymentForm.resetForm();
  }

  public getHostServerName(hostServerId: string): string {
    if (!this.hostServers || !hostServerId) {
      return '';
    }
    for (const hostServer of this.hostServers) {
      if (hostServer.id == hostServerId) {
        return hostServer.name;
      }
    }
    return null;
  }

  public getDeploymentBaseUrl(deployment: Deployment): string {
    const hostServerName: string = this.getHostServerName(deployment.hostServerId);

    return Deployment.getBaseUrl(deployment, hostServerName);
  }

  public createDeploymentFromFields(): void {
    if (!this.model.environment || !this.model.hostServerId || !this.model.contextName) {
      return;
    }

    const deployment: Deployment = new Deployment();
    deployment.applicationId = this.passedApplication.id;
    deployment.environment = this.model.environment;
    deployment.directory = this.model.directory;
    deployment.https = this.model.https;
    deployment.hostServerId = this.model.hostServerId;
    deployment.port = this.model.port;
    deployment.contextName = this.model.contextName;

    this.deployments.push(deployment);
  }

  public fieldsHaveNotBeenChanged(): boolean {
    if (this.deployments.length === 0) {
      return false;
    }

    const lastDeploymentAdded: Deployment = this.deployments[this.deployments.length - 1];
    return lastDeploymentAdded.environment === this.model.environment
      && lastDeploymentAdded.hostServerId === this.model.hostServerId
      && lastDeploymentAdded.port === this.model.port
      && lastDeploymentAdded.contextName === this.model.contextName;
  }

  public backToApplication(): void {
    const application: Deployment = Object.assign({}, this.passedApplication);

    this.cancelAppDeploymentEvent.emit(application);
    this.setDefaultValues();
  }

  public addToApplication(): void {
    if (!this.fieldsHaveNotBeenChanged()) {
      this.createDeploymentFromFields();
    }

    const deployments: Deployment[] = Object.assign([], this.deployments);
    const application: Application = Object.assign({}, this.passedApplication);

    this.createAppDeploymentEvent.emit({application, deployments});
    this.setDefaultValues();
    this.newDeploymentForm.resetForm();
  }
}
