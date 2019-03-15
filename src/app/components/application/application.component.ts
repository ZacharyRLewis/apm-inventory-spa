import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModalService, ShareDataService} from '@win-angular/services';
import {Application, ApplicationType, Dependency, Deployment} from '../../model';
import {ApplicationService, DependencyService, DeploymentService} from '../../services';

@Component({
  selector: 'apm-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent {

  @Input() modalId: string;
  @Output() createEvent: EventEmitter<Application> = new EventEmitter<Application>();
  @Output() deleteEvent: EventEmitter<Application> = new EventEmitter<Application>();
  @Output() updateEvent: EventEmitter<Application> = new EventEmitter<Application>();
  @Output() addDeploymentEvent: EventEmitter<Application> = new EventEmitter<Application>();

  model: Application = new Application();
  passedApplication: Application;
  applicationTypes: ApplicationType[] = [];
  deployments: Deployment[] = [];
  dependencies: Dependency[] = [];

  constructor(private applicationService: ApplicationService, private deploymentService: DeploymentService, private modalService: ModalService,
              private dependencyService: DependencyService, private shareDataService: ShareDataService) {
    this.setDefaultValues();
  }

  public setDefaultValues(): void {
    this.model.id = null;
    this.model.name = '';
    this.model.mnemonic = '';
    this.model.description = '';
    this.model.repository = '';
    this.model.defaultBranch = '';
    this.model.applicationType = new ApplicationType();
    this.model.applicationType.name = '';
    this.model.deployments = [];
    this.model.dependencies = [];
    this.deployments = [];
    this.dependencies = [];
  }

  public loadDeployments = () => {
    if (this.passedApplication.id) {
      this.deploymentService.findAllByApplicationId(this.passedApplication.id)
        .subscribe(response => {
          const preloadedDeployments: Deployment[] = [];

          this.deployments.forEach(deployment => {
            if (!deployment.id || deployment.id === '0') {
              preloadedDeployments.push(deployment);
            }
          });

          this.deployments = [...preloadedDeployments, ...response.data];
        });
    }
  }

  public loadDependencies = () => {
    if (this.passedApplication.id) {
      this.dependencyService.findAllByApplicationId(this.passedApplication.id)
        .subscribe(response => {
          this.dependencies = response.data;
        });
    }
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
      .subscribe(result => {
          const returned: Application = result.data;

          this.deployments.forEach(deployment => {
            if (!deployment.id || deployment.id === '0') {
              this.createDeployment(returned, deployment);
            }
          });

          this.closeModal();
          this.setDefaultValues();
          this.createEvent.emit(created);
          this.deployments = [];
        },
        err => {
          console.log('ERR:(create application) >> ' + err.message);
        });
  }

  public updateApplication(): void {
    const updated: Application = Object.assign({}, this.model);

    this.applicationService.update(updated)
      .subscribe(result => {
          const returned: Application = result.data;

          this.deployments.forEach(deployment => {
            if (!deployment.id || deployment.id === '0') {
              this.createDeployment(returned, deployment);
            }
          });

          this.closeModal();
          this.setDefaultValues();
          this.updateEvent.emit(updated);
          this.deployments = [];
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

  public refreshDependencies(): void {
    this.shareDataService.blockUI(true);

    this.dependencyService.refreshDependencies(this.passedApplication.id)
      .subscribe(response => {
        this.dependencies = response.data;
        this.shareDataService.blockUI(false);
      }, err => {
        console.log('ERR:(refresh application dependencies) >> ' + err.message);
        this.shareDataService.blockUI(false);
      });
  }

  public createDeployment(application: Application, deployment: Deployment): void {
    deployment.applicationId = application.id;

    this.deploymentService.create(deployment)
      .subscribe(res => {
          const created: Deployment = res.data;
          console.log('Successfully added deployment to application: ' + JSON.stringify(created));
        },
        err => {
          console.log('ERR:(create deployment) >> ' + err.message);
        });
  }
}
