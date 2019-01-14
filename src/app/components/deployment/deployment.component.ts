import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Application, Deployment} from '../../model';
import {DeploymentService, ModalService} from '../../services';

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

  model: Deployment = new Deployment();
  passedDeployment: Deployment;
  environments: string[] = ['DEV', 'QA', 'PROD'];
  applications: Application[] = [];

  constructor(private deploymentService: DeploymentService, private modalService: ModalService) {
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

  public closeModal(): void {
    this.modalService.close(this.modalId);
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
}
