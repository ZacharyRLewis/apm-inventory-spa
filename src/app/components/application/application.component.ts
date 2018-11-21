import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Application, ApplicationType, Deployment, ServiceCall} from '../../model';
import {ApplicationService, DeploymentService, ModalService} from '../../services';

@Component({
  selector: 'apm-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

  @Input() modalId: string;
  @Output() createEvent: EventEmitter<Application> = new EventEmitter<Application>();
  @Output() deleteEvent: EventEmitter<Application> = new EventEmitter<Application>();
  @Output() updateEvent: EventEmitter<Application> = new EventEmitter<Application>();

  model: Application = new Application();
  passedApplication: Application;
  applicationTypes: ApplicationType[] = [];
  environments: string[] = ['DEV', 'QA', 'PROD'];
  serviceApplications: Application[] = [];

  constructor(private applicationService: ApplicationService, private deploymentService: DeploymentService, private modalService: ModalService) {
    this.setDefaultValues();
  }

  ngOnInit() {
    this.loadServiceApplications();
  }

  public setDefaultValues(): void {
    this.model.id = null;
    this.model.name = '';
    this.model.mnemonic = '';
    this.model.description = '';
    this.model.applicationType = new ApplicationType();
    this.model.applicationType.name = '';
    this.model.deployments = [];
    this.model.dependencies = [];
  }

  public closeModal(): void {
    this.modalService.close(this.modalId);
  }

  public saveApplication(): void {
    if (this.passedApplication) {
      this.updateApplication();
    } else {
      this.createApplication();
    }
  }

  public createApplication(): void {
    const created: Application = Object.assign({}, this.model);

    this.applicationService.create(created)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.createEvent.emit(created);
        },
        err => {
          console.log('ERR:(create application) >> ' + err.message);
        });
  }

  public updateApplication(): void {
    const updated: Application = Object.assign({}, this.model);

    this.applicationService.update(updated)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.updateEvent.emit(updated);
        },
        err => {
          console.log('ERR:(update application) >> ' + err.message);
        });
  }

  public deleteApplication(): void {
    const deleted: Application = Object.assign({}, this.model);

    this.applicationService.delete(deleted)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.deleteEvent.emit(deleted);
        },
        err => {
          console.log('ERR:(delete application) >> ' + err.message);
        });
  }

  public addDeployment(): void {
    this.model.deployments.push(new Deployment());
  }

  public deleteDeployment(deployment: Deployment): void {
    const index: number = this.model.deployments.indexOf(deployment);

    if (index > -1) {
      this.model.deployments.splice(index, 1);

      if (deployment.id) {
        this.deploymentService.delete(deployment);
      }
    }
  }

  public addService(deployment: Deployment): void {
    const index: number = this.model.deployments.indexOf(deployment);

    if (index > -1) {
      this.model.deployments[index].services.push(new ServiceCall());
    }
  }

  public deleteService(deployment: Deployment, service: ServiceCall): void {
    const index: number = this.model.deployments.indexOf(deployment);

    if (index > -1) {
      const serviceIndex: number = this.model.deployments[index].services.indexOf(service);

      if (serviceIndex > -1) {
        this.model.deployments[index].services.splice(serviceIndex, 1);
      }
    }
  }

  public getIndexOfApplication(applicationId: string): number {
    for (let i = 0; i < this.serviceApplications.length; i++) {
      if (this.serviceApplications[i].id == applicationId) {
        return i;
      }
    }
    return -1;
  }

  public getIndexOfDeployment(application: Application, deploymentId: string): number {
    for (let i = 0; i < application.deployments.length; i++) {
      if (application.deployments[i].id == deploymentId) {
        return i;
      }
    }
    return -1;
  }

  public getDeploymentBaseUrl(deployment: Deployment): string {
    return Deployment.getBaseUrl(deployment);
  }

  public changeServiceName(service: ServiceCall): void {
    const app = this.serviceApplications[this.getIndexOfApplication(service.serviceApplicationId)];
    service.serviceName = app.name;
  }

  public changeServiceBaseUrl(service: ServiceCall): void {
    const app = this.serviceApplications[this.getIndexOfApplication(service.serviceApplicationId)];
    const dep = app.deployments[this.getIndexOfDeployment(app, service.serviceDeploymentId)];
    service.deploymentId = dep.id;
    service.serviceBaseUrl = Deployment.getBaseUrl(dep);
  }

  loadServiceApplications = () => {
    const params = [
      {name: 'isServiceApi', value: true}
    ];

    this.applicationService.filterAll(params)
      .subscribe(response => {
        this.serviceApplications = response.data;
      });
  }
}
