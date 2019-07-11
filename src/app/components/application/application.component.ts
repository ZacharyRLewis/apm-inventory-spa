import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ModalService, ShareDataService} from '@win-angular/services';
import {Application, ApplicationType, Dependency, DependencyRefresh, Deployment, DeploymentDatabase, HostServer, Permissions} from '../../model';
import {ApplicationService, DependencyService, DeploymentService, PermissionsService} from '../../services';

@Component({
  selector: 'apm-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent {

  @Input() modalId: string;
  @Input() applicationTypes: ApplicationType[] = [];
  @Input() hostServers: HostServer[] = [];

  @Output() createEvent: EventEmitter<Application> = new EventEmitter<Application>();
  @Output() deleteEvent: EventEmitter<Application> = new EventEmitter<Application>();
  @Output() updateEvent: EventEmitter<Application> = new EventEmitter<Application>();
  @Output() addDeploymentEvent: EventEmitter<Application> = new EventEmitter<Application>();
  @Output() openDeploymentModalEvent: EventEmitter<object> = new EventEmitter<object>();

  public model: Application = new Application();
  public passedApplication: Application;
  public deployments: Deployment[] = [];
  public dependencies: Dependency[] = [];
  public deploymentsAdded = false;
  public dependenciesRefreshed = false;
  public permissions: Permissions;

  // Panel controls
  public collapseGeneralInfoPanel = false;
  public collapseTagsPanel = true;
  public collapseSourceCodePanel = true;
  public collapseOwnershipPanel = true;
  public collapseDeploymentsPanel = true;
  public collapseDependenciesPanel = true;

  @ViewChild('newApplicationForm')
  public newApplicationForm;

  constructor(private applicationService: ApplicationService, private deploymentService: DeploymentService,
              private modalService: ModalService, private dependencyService: DependencyService,
              private shareDataService: ShareDataService, private permissionsService: PermissionsService) {
    this.setDefaultValues();
    this.permissionsService.findUserPermissions()
      .subscribe(response => {
        this.permissions = response.data;
      });
  }

  public setDefaultValues(): void {
    this.model.id = null;
    this.model.name = '';
    this.model.longName = '';
    this.model.description = '';
    this.model.repository = '';
    this.model.defaultBranch = '';
    this.model.owningDepartment = '';
    this.model.primaryContactName = '';
    this.model.primaryContactEmail = '';
    this.model.primaryContactPhone = '';
    this.model.applicationTypeId = '';
    this.model.tags = [];
    this.model.owners = [];
    this.model.deployments = [];
    this.model.dependencies = [];
    this.deployments = [];
    this.dependencies = [];
    this.deploymentsAdded = false;
    this.dependenciesRefreshed = false;
    this.collapseGeneralInfoPanel = false;
    this.collapseTagsPanel = true;
    this.collapseSourceCodePanel = true;
    this.collapseOwnershipPanel = true;
    this.collapseDeploymentsPanel = true;
    this.collapseDependenciesPanel = true;
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
    this.newApplicationForm.resetForm();
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

  public hasApplicationPermissions(): boolean {
    return this.permissions.permissions.indexOf('APM_Admin') >= 0 || this.passedApplication.owners.indexOf(this.permissions.username) >= 0;
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
          this.createEvent.emit(created);
          this.deployments = [];
        },
        err => {
          this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(create application) >> ' + err.message}]);
        });
  }

  public updateApplication(): void {
    const updated: Application = Object.assign({}, this.model);

    if (!this.hasApplicationPermissions()) {
      this.shareDataService.showStatus([{severity: 'error', summary: 'You are not authorized to update this application'}]);
      return;
    }

    this.applicationService.update(updated)
      .subscribe(result => {
          const returned: Application = result.data;

          this.deployments.forEach(deployment => {
            if (!deployment.id || deployment.id === '0') {
              this.createDeployment(returned, deployment);
            }
          });

          this.closeModal();
          this.updateEvent.emit(updated);
          this.deployments = [];
        },
        err => {
          this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(update application) >> ' + err.message}]);
        });
  }

  public deleteApplication(): void {
    const deleted: Application = Object.assign({}, this.model);

    if (!this.hasApplicationPermissions()) {
      this.shareDataService.showStatus([{severity: 'error', summary: 'You are not authorized to delete this application'}]);
      return;
    }

    if (this.deployments.length > 0) {
      this.shareDataService.showStatus([{severity: 'error', summary: 'This application cannot be deleted because it has deployments'}]);
      return;
    }

    this.applicationService.delete(deleted)
      .subscribe(res => {
          this.closeModal();
          this.deleteEvent.emit(deleted);
        },
        err => {
          this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(delete application) >> ' + err.message}]);
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

  public addDeployments(): void {
    const application: Application = Object.assign({}, this.model);

    if (!this.hasApplicationPermissions()) {
      this.shareDataService.showStatus([{severity: 'error', summary: 'You are not authorized to add deployments to this application'}]);
      return;
    }

    this.addDeploymentEvent.emit(application);
  }

  public openDeploymentModal(deployment: Deployment): void {
    const application: Application = Object.assign({}, this.passedApplication);

    if (!this.hasApplicationPermissions()) {
      this.shareDataService.showStatus([{severity: 'error', summary: 'You are not authorized to maintain deployments for this application'}]);
      return;
    }

    this.openDeploymentModalEvent.emit({application, deployment});
  }

  public refreshDependencies(): void {
    if (!this.hasApplicationPermissions()) {
      this.shareDataService.showStatus([{severity: 'error', summary: 'You are not authorized to refresh dependencies for this application'}]);
      return;
    }

    this.shareDataService.blockUI(true);

    this.dependencyService.refreshDependencies(new DependencyRefresh(this.passedApplication.id))
      .subscribe(response => {
        this.dependencies = response.data;
        this.shareDataService.blockUI(false);
        this.dependenciesRefreshed = true;
      }, err => {
        this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(refresh application dependencies) >> ' + err.message}]);
        this.shareDataService.blockUI(false);
      });
  }

  public createDeployment(application: Application, deployment: Deployment): void {
    deployment.applicationId = application.id;

    this.deploymentService.create(deployment)
      .subscribe(res => {
          const created: Deployment = res.data;
          this.shareDataService.showStatus([{severity: 'success', summary: 'Successfully added deployment: ' + JSON.stringify(created)}]);
        },
        err => {
          this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(create deployment) >> ' + err.message}]);
        });
  }

  public inputValidationClass(inputField: any): string {
    let returnVal = '';
    if (inputField && (inputField.touched || inputField.dirty)) {
      returnVal = inputField.valid ? 'is-valid' : 'is-invalid';
    }
    return returnVal;
  }

  public dependenciesSupportedForAppType(applicationTypeId: string): boolean {
    if (!this.applicationTypes || !applicationTypeId) {
      return false;
    }
    for (const applicationType of this.applicationTypes) {
      if (applicationType.id == applicationTypeId) {
        switch (applicationType.name) {
          case 'Angular':
          case 'AngularJS':
          case 'Grails':
          case 'Spring Boot':
            return true;
          default:
            return false;
        }
      }
    }
    return false;
  }
}
