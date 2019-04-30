import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModalService} from '@win-angular/services';
import {Application, Database, Deployment, DeploymentDatabase, HostServer, MulesoftApi} from '../../model';
import {DatabaseService, DeploymentDatabaseService, DeploymentService, MulesoftApiService} from '../../services';

@Component({
  selector: 'apm-deployment',
  templateUrl: './deployment.component.html',
  styleUrls: ['./deployment.component.scss']
})
export class DeploymentComponent implements OnInit {

  @Input() modalId: string;
  @Input() applications: Application[] = [];
  @Input() hostServers: HostServer[] = [];

  @Output() createEvent: EventEmitter<Deployment> = new EventEmitter<Deployment>();
  @Output() deleteEvent: EventEmitter<Deployment> = new EventEmitter<Deployment>();
  @Output() updateEvent: EventEmitter<Deployment> = new EventEmitter<Deployment>();
  @Output() addDatabaseEvent: EventEmitter<Deployment> = new EventEmitter<Deployment>();

  public model: Deployment = new Deployment();
  public passedApplication: Application;
  public passedDeployment: Deployment;
  public environments: string[] = ['DEV', 'QA', 'PROD'];
  public databases: Database[] = [];
  public deploymentDatabases: DeploymentDatabase[] = [];
  public apis: MulesoftApi[] = [];

  constructor(private deploymentService: DeploymentService, private modalService: ModalService, private databaseService: DatabaseService,
              private deploymentDatabaseService: DeploymentDatabaseService, private mulesoftAssetService: MulesoftApiService) {
    this.setDefaultValues();
  }

  public setDefaultValues(): void {
    this.model.id = null;
    this.model.applicationId = null;
    this.model.environment = '';
    this.model.directory = '';
    this.model.https = null;
    this.model.hostServerId = '';
    this.model.port = '';
    this.model.contextName = '';
    this.model.databases = [];
    this.model.services = [];
    this.databases = [];
    this.deploymentDatabases = [];
    this.apis = [];
  }

  ngOnInit() {
    this.loadDatabases();
  }

  public loadDatabases = () => {
    this.databaseService.findAll()
      .subscribe(response => {
        this.databases = response.data;
      });
  }

  public loadDeploymentDatabases = () => {
    this.deploymentDatabaseService.findAllByDeploymentId(this.passedDeployment.id)
      .subscribe(response => {
        this.deploymentDatabases = response.data;
      });
  }

  public loadApis = (assetId: string) => {
    const params = [{name: 'assetId', value: assetId}];

    this.mulesoftAssetService.filterAll(params)
      .subscribe(response => {
        const matchingApis: MulesoftApi[] = [];

        response.data.forEach(api => {
          if (api.implementationUrl === this.getDeploymentBaseUrl(this.model)) {
            matchingApis.push(api);
          }
        });

        this.apis = matchingApis;
      });
  }

  public closeModal(): void {
    this.modalService.closeModal(this.modalId);
    this.setDefaultValues();
  }

  public saveDeployment(): void {
    if (this.passedDeployment) {
      this.updateDeployment();
    } else {
      this.createDeployment();
    }
  }

  public createDeployment(): void {
    const created: Deployment = Object.assign({}, this.model);

    this.deploymentService.create(created)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.createEvent.emit(created);
        },
        err => {
          console.log('ERR:(create deployment) >> ' + err.message);
        });
  }

  public updateDeployment(): void {
    const updated: Deployment = Object.assign({}, this.model);

    this.deploymentService.update(updated)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.updateEvent.emit(updated);
        },
        err => {
          console.log('ERR:(update deployment) >> ' + err.message);
        });
  }

  public deleteDeployment(): void {
    const deleted: Deployment = Object.assign({}, this.model);

    this.deploymentService.delete(deleted)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.deleteEvent.emit(deleted);
        },
        err => {
          console.log('ERR:(delete deployment) >> ' + err.message);
        });
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

  public formatApiUrl(api: MulesoftApi): string {
    let host = '';

    switch (api.deploymentEnvironment) {
      case 'Sandbox': host = 'https://devag1.winwholesale.com/';
        break;
      case 'QA': host = 'https://qaag1.winwholesale.com/';
        break;
      default: host = 'https://ag1.winwholesale.com/';
    }

    return host + this.model.contextName;
  }

  public addDatabase(): void {
    const deployment: Deployment = Object.assign({}, this.model);

    this.addDatabaseEvent.emit(deployment);
  }

  public getDatabaseName(databaseId: string): string {
    if (!this.databases || !databaseId) {
      return '';
    }
    for (const database of this.databases) {
      if (database.id === databaseId) {
        return database.name;
      }
    }
    return null;
  }

  public getDatabaseHost(databaseId: string): string {
    if (!this.databases || !databaseId) {
      return '';
    }
    for (const database of this.databases) {
      if (database.id === databaseId) {
        return database.hostName;
      }
    }
    return null;
  }
}
