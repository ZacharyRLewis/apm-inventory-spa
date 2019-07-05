import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalService, ShareDataService} from '@win-angular/services';
import {Application, Deployment, DeploymentDatabase, HostServer} from '../../model';
import {DeploymentFilters} from '../../model/deployment-filters';
import {ApplicationService, HostServerService} from '../../services';
import {DeploymentService} from '../../services/deployment/deployment.service';
import {DeploymentDatabaseComponent} from './deployment-database.component';
import {DeploymentComponent} from './deployment.component';

@Component({
  selector: 'apm-deployment-list',
  templateUrl: './deployment-list.component.html',
  styleUrls: ['./deployment-list.component.scss']
})
export class DeploymentListComponent implements OnInit  {

  public deployments: Deployment[] = [];
  public applications: Application[] = [];
  public hostServers: HostServer[] = [];
  public filters = new DeploymentFilters();

  public DEPLOYMENT_MODAL_ID = 'deployment-modal';
  public DEPLOYMENT_DATABASE_MODAL_ID = 'deployment-database-modal';

  public columns = [
    {field: 'id', header: 'Id', width: '30px'},
    {field: 'applicationId', header: 'Application Name', width: '100px'},
    {field: 'environment', header: 'Environment', width: '60px'},
    {field: 'hostServerId', header: 'Base URL', width: '200px'}
  ];

  @ViewChild('deploymentComponent')
  public deploymentComponent: DeploymentComponent;

  @ViewChild('deploymentDatabaseComponent')
  public deploymentDatabaseComponent: DeploymentDatabaseComponent;

  constructor(private applicationService: ApplicationService, private deploymentService: DeploymentService,
              private hostServerService: HostServerService, private modalService: ModalService, private shareDataService: ShareDataService) {
    this.refreshDeployments();
  }

  ngOnInit() {
    this.loadApplications();
    this.loadHostServers();
  }

  public loadApplications = () => {
    this.applicationService.findAll()
      .subscribe(response => {
        this.applications = response.data;
      });
  }

  public loadHostServers = () => {
    this.hostServerService.findAll()
      .subscribe(response => {
        this.hostServers = response.data;
      });
  }

  public refreshDeployments(): void {
    this.deploymentService.findAll()
      .subscribe(response => {
        this.deployments = response.data;
      });
  }

  public searchDeployments(): void {
    const params = [];

    if (this.filters.applicationId) {
      params.push({name: 'applicationId', value: this.filters.applicationId});
    }

    if (this.filters.environment) {
      params.push({name: 'environment', value: this.filters.environment});
    }

    if (this.filters.hostServerId) {
      params.push({name: 'hostServerId', value: this.filters.hostServerId});
    }

    this.deploymentService.filterAll(params)
      .subscribe(response => {
        this.deployments = response.data;
      });
  }

  public resetDeploymentComponent(): void {
    this.deploymentComponent.passedDeployment = null;
    this.deploymentComponent.applications = this.applications;
    this.deploymentComponent.setDefaultValues();
  }

  public prepareDeploymentModal(deployment: Deployment): void {
    this.deploymentComponent.passedDeployment = Object.assign({}, deployment);
    this.deploymentComponent.model = Object.assign({}, deployment);
    this.deploymentComponent.loadDatabases();
    this.deploymentComponent.loadDeploymentDatabases();
    this.deploymentComponent.loadApis(deployment.contextName);
  }

  public prepareDeploymentDatabaseModal(deployment: Deployment, deploymentDatabase: DeploymentDatabase): void {
    this.deploymentDatabaseComponent.passedDeployment = Object.assign({}, deployment);

    if (deploymentDatabase) {
      this.deploymentDatabaseComponent.passedDeploymentDatabase = Object.assign({}, deploymentDatabase);
      this.deploymentDatabaseComponent.model = Object.assign({}, deploymentDatabase);
    }
  }

  public openModal(modalId: string): void {
    this.modalService.openModal(modalId);
  }

  public closeModal(modalId: string): void {
    this.modalService.closeModal(modalId);
  }

  public handleCreate(deployment: Deployment): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Deployment ' + deployment.contextName + ' successfully created'}]);
    this.refreshDeployments();
  }

  public handleDelete(deployment: Deployment): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Deployment ' + deployment.contextName + ' successfully deleted'}]);
    this.refreshDeployments();
  }

  public handleUpdate(deployment: Deployment): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Deployment ' + deployment.contextName + ' successfully updated'}]);
    this.refreshDeployments();
  }

  public handleDeploymentDatabaseCancel(deployment: Deployment): void {
    this.prepareDeploymentModal(deployment);
    this.closeModal(this.DEPLOYMENT_DATABASE_MODAL_ID);
    this.openModal(this.DEPLOYMENT_MODAL_ID);
  }

  public handleDeploymentDatabaseUpdate(deployment: Deployment): void {
    this.prepareDeploymentModal(deployment);
    this.deploymentComponent.loadDeploymentDatabases();
    this.deploymentComponent.databasesAdded = true;
    this.closeModal(this.DEPLOYMENT_DATABASE_MODAL_ID);
    this.openModal(this.DEPLOYMENT_MODAL_ID);
  }

  public openDeploymentDatabaseModal({deployment, deploymentDatabase}): void {
    this.deploymentDatabaseComponent.loadDatabases();
    this.prepareDeploymentDatabaseModal(deployment, deploymentDatabase);
    this.closeModal(this.DEPLOYMENT_MODAL_ID);
    this.openModal(this.DEPLOYMENT_DATABASE_MODAL_ID);
  }

  public getAppName(applicationId: string): string {
    if (!this.applications || !applicationId) {
      return '';
    }
    for (const application of this.applications) {
      if (application.id === applicationId) {
        return application.name;
      }
    }
    return null;
  }

  public getHostServerName(hostServerId: string): string {
    if (!this.hostServers || !hostServerId) {
      return '';
    }
    for (const hostServer of this.hostServers) {
      if (hostServer.id === hostServerId) {
        return hostServer.name;
      }
    }
    return null;
  }

  public getDeploymentBaseUrl(deployment: Deployment): string {
    const hostServerName: string = this.getHostServerName(deployment.hostServerId);

    return Deployment.getBaseUrl(deployment, hostServerName);
  }

  public resetFilters(event?): void {
    this.filters = new DeploymentFilters();
    this.filters.applicationId = '';
    this.filters.environment = '';
    this.filters.hostServerId = '';
    this.deployments = [];
    this.searchDeployments();
  }
}
