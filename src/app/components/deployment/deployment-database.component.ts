import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ModalService, ShareDataService} from '@win-angular/services';
import {Database, Deployment, DeploymentDatabase} from '../../model';
import {DatabaseService, DeploymentDatabaseService} from '../../services';

@Component({
  selector: 'apm-deployment-database',
  templateUrl: './deployment-database.component.html',
  styleUrls: ['./deployment-database.component.scss']
})
export class DeploymentDatabaseComponent {

  @Input() modalId: string;
  @Output() updateDatabaseEvent: EventEmitter<Deployment> = new EventEmitter<Deployment>();
  @Output() cancelAddDatabaseEvent: EventEmitter<Deployment> = new EventEmitter<Deployment>();

  public model: DeploymentDatabase = new DeploymentDatabase();
  public passedDeployment: Deployment;
  public passedDeploymentDatabase: DeploymentDatabase;
  public databases: Database[] = [];

  @ViewChild('newDeploymentDatabaseForm')
  public newDeploymentDatabaseForm;

  constructor(private deploymentDatabaseService: DeploymentDatabaseService, private databaseService: DatabaseService,
              private modalService: ModalService, private shareDataService: ShareDataService) {
    this.setDefaultValues();
  }

  public setDefaultValues(): void {
    this.passedDeployment = new Deployment('');
    this.model.id = null;
    this.model.databaseId = null;
    this.model.deploymentId = null;
    this.model.deployment = null;
    this.model.database = null;
    this.model.connectionUsername = '';
  }

  public loadDatabases = () => {
    this.databaseService.findAll()
      .subscribe(response => {
        this.databases = response.data;
      });
  }

  public closeModal(): void {
    this.backToDeployment();
    this.newDeploymentDatabaseForm.resetForm();
    this.setDefaultValues();
  }

  /**
   * Callback function to be called when the user presses the back button in the browser.
   * Closes the modal and unregisters the event listener.
   */
  public backButtonCallback = () => {
    this.modalService.unregisterPopState(this.backButtonCallback);
    this.modalService.closeModal(this.modalId);
  }

  public saveDeploymentDatabase(): void {
    if (this.passedDeploymentDatabase) {
      this.updateDeploymentDatabase();
    } else {
      this.createDeploymentDatabase();
    }
  }

  public createDeploymentDatabase(): void {
    const created: DeploymentDatabase = Object.assign({}, this.model);
    const deployment: Deployment = Object.assign({}, this.passedDeployment);

    created.deploymentId = deployment.id;

    this.deploymentDatabaseService.create(created)
      .subscribe(result => {
          this.updateDatabaseEvent.emit(deployment);
          this.newDeploymentDatabaseForm.resetForm();
          this.setDefaultValues();
        },
        err => {
          this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(create deployment database) >> ' + err.message}]);
        });
  }

  public updateDeploymentDatabase(): void {
    const updated: DeploymentDatabase = Object.assign({}, this.model);
    const deployment: Deployment = Object.assign({}, this.passedDeployment);

    this.deploymentDatabaseService.update(updated)
      .subscribe(res => {
          this.updateDatabaseEvent.emit(deployment);
          this.newDeploymentDatabaseForm.resetForm();
          this.setDefaultValues();
        },
        err => {
          this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(update deployment database) >> ' + err.message}]);
        });
  }

  public deleteDeploymentDatabase(): void {
    const deleted: DeploymentDatabase = Object.assign({}, this.model);
    const deployment: Deployment = Object.assign({}, this.passedDeployment);

    this.deploymentDatabaseService.delete(deleted)
      .subscribe(res => {
          this.updateDatabaseEvent.emit(deployment);
          this.newDeploymentDatabaseForm.resetForm();
          this.setDefaultValues();
        },
        err => {
          this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(delete deployment database) >> ' + err.message}]);
        });
  }

  public backToDeployment(): void {
    const deployment: Deployment = Object.assign({}, this.passedDeployment);

    this.cancelAddDatabaseEvent.emit(deployment);
    this.setDefaultValues();
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
