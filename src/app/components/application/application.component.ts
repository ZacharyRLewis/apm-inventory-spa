import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModalService} from '@win-angular/services';
import {Application, ApplicationType, Dependency, Deployment} from '../../model';
import {ApplicationService, DependencyService, DeploymentService} from '../../services';

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
  @Output() addDeploymentEvent: EventEmitter<Application> = new EventEmitter<Application>();
  @Output() uploadDependenciesEvent: EventEmitter<Application> = new EventEmitter<Application>();

  model: Application = new Application();
  passedApplication: Application;
  applicationTypes: ApplicationType[] = [];
  deployments: Deployment[] = [];
  dependencies: Dependency[] = [];

  constructor(private applicationService: ApplicationService, private deploymentService: DeploymentService,
              private dependencyService: DependencyService, private modalService: ModalService) {
    this.setDefaultValues();
  }

  ngOnInit() {
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

  public loadDeployments = () => {
    this.deploymentService.findAllByApplicationId(this.passedApplication.id)
      .subscribe(response => {
        this.deployments = response.data;
      });
  }

  public loadDependencies = () => {
    this.dependencyService.findAllByApplicationId(this.passedApplication.id)
      .subscribe(response => {
        this.dependencies = response.data;
      });
  }

  public closeModal(): void {
    this.modalService.closeModal(this.modalId);
  }

  public saveApplication(): void {
    if (this.passedApplication && this.passedApplication.id) {
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

  public getDeploymentBaseUrl(deployment: Deployment): string {
    return Deployment.getBaseUrl(deployment);
  }

  public addDeployment(): void {
    const application: Application = Object.assign({}, this.model);

    this.addDeploymentEvent.emit(application);
  }

  public uploadDependencies(): void {
    const application: Application = Object.assign({}, this.model);

    this.uploadDependenciesEvent.emit(application);
  }
}
