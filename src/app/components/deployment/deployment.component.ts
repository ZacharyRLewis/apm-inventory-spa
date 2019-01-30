import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModalService} from '@win-angular/services';
import {Application, Database, Deployment} from '../../model';
import {DatabaseService, DeploymentService} from '../../services';

@Component({
  selector: 'apm-deployment',
  templateUrl: './deployment.component.html',
  styleUrls: ['./deployment.component.scss']
})
export class DeploymentComponent {

  @Input() modalId: string;
  @Output() createEvent: EventEmitter<Deployment> = new EventEmitter<Deployment>();
  @Output() deleteEvent: EventEmitter<Deployment> = new EventEmitter<Deployment>();
  @Output() updateEvent: EventEmitter<Deployment> = new EventEmitter<Deployment>();
  @Output() createAppDeploymentEvent: EventEmitter<object> = new EventEmitter<object>();
  @Output() cancelAppDeploymentEvent: EventEmitter<Application> = new EventEmitter<Application>();

  model: Deployment = new Deployment();
  passedApplication: Application;
  passedDeployment: Deployment;
  environments: string[] = ['DEV', 'QA', 'PROD'];
  applications: Application[] = [];
  databases: Database[] = [];

  constructor(private deploymentService: DeploymentService, private modalService: ModalService, private databaseService: DatabaseService) {
    this.setDefaultValues();
  }

  public setDefaultValues(): void {
    this.model.id = null;
    this.model.applicationId = null;
    this.model.environment = '';
    this.model.directory = '';
    this.model.https = null;
    this.model.hostServer = '';
    this.model.port = '';
    this.model.contextName = '';
    this.model.databases = [];
    this.model.services = [];
  }

  public loadDatabases = () => {
    this.databaseService.findAllByDeploymentId(this.passedDeployment.id)
      .subscribe(response => {
        this.databases = response.data;
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

  public getDeploymentBaseUrl(deployment: Deployment): string {
    return Deployment.getBaseUrl(deployment);
  }

  public backToApplication(): void {
    const application: Deployment = Object.assign({}, this.passedApplication);

    this.cancelAppDeploymentEvent.emit(application);
  }

  public addToApplication(): void {
    const deployment: Deployment = Object.assign({}, this.model);
    const application: Deployment = Object.assign({}, this.passedApplication);

    this.createAppDeploymentEvent.emit({application, deployment});
  }
}
