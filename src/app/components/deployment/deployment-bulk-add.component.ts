import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModalService} from '@win-angular/services';
import {Application, Deployment, HostServer} from '../../model';
import {DeploymentService} from '../../services';

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
  public passedApplication: Application;
  public environments: string[] = ['DEV', 'QA', 'PROD'];
  public directory = '';
  public environment = '';
  public https = false;
  public hostServerId = '';
  public port = '';
  public contextName = '';

  constructor(private deploymentService: DeploymentService, private modalService: ModalService) {
    this.setDefaultValues();
  }

  public setDefaultValues(): void {
    this.passedApplication = new Application();
    this.passedApplication.id = '';
    this.deployments = [];
    this.directory = '';
    this.environment = '';
    this.https = false;
    this.hostServerId = '';
    this.port = '';
    this.contextName = '';
  }

  public closeModal(): void {
    this.modalService.closeModal(this.modalId);
    this.setDefaultValues();
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
    if (!this.environment || !this.hostServerId || !this.port || !this.contextName) {
      return;
    }

    const deployment: Deployment = new Deployment();
    deployment.applicationId = this.passedApplication.id;
    deployment.environment = this.environment;
    deployment.directory = this.directory;
    deployment.https = this.https;
    deployment.hostServerId = this.hostServerId;
    deployment.port = this.port;
    deployment.contextName = this.contextName;

    this.deployments.push(deployment);
  }

  public fieldsHaveNotBeenChanged(): boolean {
    if (this.deployments.length === 0) {
      return false;
    }

    const lastDeploymentAdded: Deployment = this.deployments[this.deployments.length - 1];
    return lastDeploymentAdded.environment === this.environment
      && lastDeploymentAdded.hostServerId === this.hostServerId
      && lastDeploymentAdded.port === this.port
      && lastDeploymentAdded.contextName === this.contextName;
  }

  public backToApplication(): void {
    const application: Deployment = Object.assign({}, this.passedApplication);

    this.cancelAppDeploymentEvent.emit(application);
    this.setDefaultValues();
  }

  public addToApplication(): void {
    this.createDeploymentFromFields();

    const deployments: Deployment[] = Object.assign([], this.deployments);
    const application: Application = Object.assign({}, this.passedApplication);

    this.createAppDeploymentEvent.emit({application, deployments});
    this.setDefaultValues();
  }
}
