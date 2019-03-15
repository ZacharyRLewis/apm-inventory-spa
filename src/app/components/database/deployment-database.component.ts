import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ModalService} from '@win-angular/services';
import {Database, Deployment, DeploymentDatabase} from '../../model';
import {DatabaseService, DeploymentDatabaseService} from '../../services';

@Component({
  selector: 'apm-deployment-database',
  templateUrl: './deployment-database.component.html',
  styleUrls: ['./deployment-database.component.scss']
})
export class DeploymentDatabaseComponent {

  @Input() modalId: string;
  @Output() addDatabaseEvent: EventEmitter<Deployment> = new EventEmitter<Deployment>();
  @Output() cancelAddDatabaseEvent: EventEmitter<Deployment> = new EventEmitter<Deployment>();

  model: DeploymentDatabase = new DeploymentDatabase();
  passedDeployment: Deployment;
  databases: Database[] = [];

  constructor(private deploymentDatabaseService: DeploymentDatabaseService, private databaseService: DatabaseService,
              private modalService: ModalService) {
    this.setDefaultValues();
  }

  public setDefaultValues(): void {
    this.passedDeployment = new Deployment('');
  }

  public loadDatabases = () => {
    this.databaseService.findAll()
      .subscribe(response => {
        this.databases = response.data;
      });
  }

  public closeModal(): void {
    this.modalService.closeModal(this.modalId);
    this.passedDeployment = null;
  }

  public addToDeployment(): void {
    const created: DeploymentDatabase = Object.assign({}, this.model);
    const deployment: Deployment = Object.assign({}, this.passedDeployment);

    created.deploymentId = deployment.id;

    this.deploymentDatabaseService.create(created)
      .subscribe(result => {
          this.closeModal();
          this.setDefaultValues();
          this.addDatabaseEvent.emit(deployment);
          this.setDefaultValues();
        },
        err => {
          console.log('ERR:(create deployment database) >> ' + err.message);
        });
  }

  public backToDeployment(): void {
    const deployment: Deployment = Object.assign({}, this.passedDeployment);

    this.cancelAddDatabaseEvent.emit(deployment);
  }

  public getDatabaseHost(deploymentDatabase: DeploymentDatabase): string {
    if (!this.databases || !deploymentDatabase || !deploymentDatabase.databaseId) {
      return '';
    }
    for (const database of this.databases) {
      if (database.id == deploymentDatabase.databaseId) {
        return database.hostName;
      }
    }
    return null;
  }
}
