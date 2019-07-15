import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalService, ShareDataService} from '@win-angular/services';
import {Application, ApplicationFilters, ApplicationType, Deployment, HostServer, SelectOption} from '../../model';
import {ApplicationService, ApplicationTypeService, HostServerService} from '../../services';
import {ApplicationComponent} from '../application/application.component';
import {DeploymentComponent} from '../deployment/deployment.component';
import {DeploymentBulkAddComponent} from '../deployment/deployment-bulk-add.component';

@Component({
  selector: 'apm-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  public applications: Application[] = [];
  public applicationTypes: ApplicationType[] = [];
  public hostServers: HostServer[] = [];
  public departments: string[] = [];
  public departmentOptions: SelectOption[] = [];
  public tagsInUse: string[] = [];
  public filters = new ApplicationFilters();

  public APPLICATION_MODAL_ID = 'application-modal';
  public DEPLOYMENT_MODAL_ID = 'deployment-modal';
  public DEPLOYMENT_BULK_ADD_MODAL_ID = 'deployment-bulk-add-modal';

  public columns = [
    {field: 'name', header: 'Name', width: '100px'},
    {field: 'owningDepartment', header: 'Department', width: '100px'},
    {field: 'description', header: 'Description', width: '150px'},
    {field: 'applicationTypeId', header: 'Type', width: '100px'}
  ];

  @ViewChild('applicationComponent')
  applicationComponent: ApplicationComponent;

  @ViewChild('deploymentComponent')
  deploymentComponent: DeploymentComponent;

  @ViewChild('deploymentBulkAddComponent')
  deploymentBulkAddComponent: DeploymentBulkAddComponent;

  constructor(private applicationService: ApplicationService, private applicationTypeService: ApplicationTypeService,
              private modalService: ModalService, private hostServerService: HostServerService, private shareDataService: ShareDataService) {
  }

  ngOnInit() {
    this.loadApplications();
    this.loadApplicationTypes();
    this.loadHostServers();
  }

  public loadApplications = () => {
    this.applicationService.findAll()
      .subscribe(response => {
        this.applications = response.data;
        this.loadDepartments();
        this.loadTagsInUse();
      });
  }

  public loadApplicationTypes = () => {
    this.applicationTypeService.findAll()
      .subscribe(response => {
        this.applicationTypes = response.data;
      });
  }

  public loadHostServers = () => {
    this.hostServerService.findAll()
      .subscribe(response => {
        this.hostServers = response.data;
      });
  }

  public loadDepartments = () => {
    for (const application of this.applications) {
      let existsInList = false;

      for (const department of this.departments) {
        if (application.owningDepartment === department) {
          existsInList = true;
          break;
        }
      }

      if (application.owningDepartment && !existsInList) {
        this.departments.push(application.owningDepartment);
        this.departmentOptions.push(new SelectOption(application.owningDepartment, application.owningDepartment));
      }
    }

    this.departments.sort();
    this.departmentOptions = this.departmentOptions.sort((a, b) => {
      return a.value.localeCompare(b.value);
    });
  }

  public loadTagsInUse = () => {
    for (const application of this.applications) {
      for (const appTag of application.tags) {

        let existsInList = false;

        for (const tag of this.tagsInUse) {
          if (appTag === tag) {
            existsInList = true;
            break;
          }
        }

        if (appTag && !existsInList) {
          this.tagsInUse.push(appTag);
        }
      }
    }
    this.tagsInUse.sort();
  }

  public searchApplications(): void {
    const params = [];

    if (this.filters.name) {
      params.push({name: 'name', value: this.filters.name});
    }

    if (this.filters.owningDepartment) {
      params.push({name: 'owningDepartment', value: this.filters.owningDepartment});
    }

    if (this.filters.isServiceApi !== undefined) {
      params.push({name: 'isServiceApi', value: this.filters.isServiceApi});
    }

    if (this.filters.applicationTypeId) {
      params.push({name: 'applicationTypeId', value: this.filters.applicationTypeId});
    }

    this.applicationService.filterAll(params)
      .subscribe(response => {
        this.applications = response.data;
      });
  }

  public resetApplicationComponent(): void {
    this.applicationComponent.passedApplication = null;
    this.applicationComponent.deployments = [];
    this.applicationComponent.dependencies = [];
    this.applicationComponent.setDefaultValues();
    this.applicationComponent.applicationTypes = this.applicationTypes;
  }

  public resetDeploymentComponent(): void {
    this.deploymentComponent.passedDeployment = null;
    this.deploymentComponent.passedApplication = null;
    this.deploymentComponent.applications = this.applications;
    this.deploymentComponent.setDefaultValues();
  }

  public prepareApplicationModal(application: Application): void {
    this.applicationComponent.passedApplication = Object.assign({}, application);
    this.applicationComponent.model = Object.assign({}, application);
    this.applicationComponent.temporaryTags = [...application.tags];
    this.applicationComponent.loadDeployments();
    this.applicationComponent.loadDependencies();
  }

  public prepareDeploymentModal({application, deployment}): void {
    this.deploymentComponent.passedApplication = Object.assign({}, application);
    this.deploymentComponent.passedDeployment = Object.assign({}, deployment);
    this.deploymentComponent.model = Object.assign({}, deployment);
    this.deploymentComponent.loadDatabases();
    this.deploymentComponent.loadDeploymentDatabases();
    this.deploymentComponent.loadApis(deployment.contextName);
    this.deploymentComponent.loadApplicationOwners();
  }

  public prepareDeploymentBulkAddModal(application: Application): void {
    this.deploymentBulkAddComponent.passedApplication = Object.assign({}, application);
  }

  public openApplicationModal(): void {
    history.pushState(null, null, document.URL);
    this.modalService.openModal(this.APPLICATION_MODAL_ID);
    this.modalService.registerPopState(this.applicationComponent.backButtonCallback);
  }

  public openDeploymentModal(): void {
    history.pushState(null, null, document.URL);
    this.modalService.openModal(this.DEPLOYMENT_MODAL_ID);
    this.modalService.registerPopState(this.deploymentComponent.backButtonCallback);
  }

  public openDeploymentBulkAddModal(): void {
    history.pushState(null, null, document.URL);
    this.modalService.openModal(this.DEPLOYMENT_BULK_ADD_MODAL_ID);
    this.modalService.registerPopState(this.deploymentBulkAddComponent.backButtonCallback);
  }

  public closeApplicationModal(): void {
    this.modalService.unregisterPopState(this.applicationComponent.backButtonCallback);
    this.modalService.closeModal(this.APPLICATION_MODAL_ID);
  }

  public closeDeploymentModal(): void {
    this.modalService.unregisterPopState(this.deploymentComponent.backButtonCallback);
    this.modalService.closeModal(this.DEPLOYMENT_MODAL_ID);
  }

  public closeDeploymentBulkAddModal(): void {
    this.modalService.unregisterPopState(this.deploymentBulkAddComponent.backButtonCallback);
    this.modalService.closeModal(this.DEPLOYMENT_BULK_ADD_MODAL_ID);
  }

  public addDeploymentToApplication(application: Application): void {
    this.prepareDeploymentBulkAddModal(application);
    this.closeApplicationModal();
    this.openDeploymentBulkAddModal();
  }

  public handleCreate(application: Application): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Application ' + application.name + ' successfully created'}]);
    this.loadApplications();
  }

  public handleDelete(application: Application): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Application ' + application.name + ' successfully deleted'}]);
    this.loadApplications();
  }

  public handleUpdate(application: Application): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Application ' + application.name + ' successfully updated'}]);
    this.loadApplications();
  }

  public handleDeploymentDelete({application, deployment}): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Deployment ' + deployment.contextName + ' successfully deleted'}]);
    this.prepareApplicationModal(application);
    this.closeDeploymentModal();
    this.openApplicationModal();
  }

  public handleDeploymentUpdate({application, deployment}): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Deployment ' + deployment.contextName + ' successfully updated'}]);
    this.prepareApplicationModal(application);
    this.closeDeploymentModal();
    this.openApplicationModal();
  }

  public handleBulkDeploymentCancel(application: Application): void {
    this.prepareApplicationModal(application);
    this.closeDeploymentBulkAddModal();
    this.openApplicationModal();
  }

  public handleBulkDeploymentCreate({application, deployments}): void {
    this.prepareApplicationModal(application);

    if (!this.applicationComponent.deployments) {
      this.applicationComponent.deployments = deployments;
    } else {
      this.applicationComponent.deployments = [...this.applicationComponent.deployments, ...deployments];
    }

    this.applicationComponent.deploymentsAdded = true;
    this.closeDeploymentBulkAddModal();
    this.openApplicationModal();
  }

  public getApplicationTypeDescription(applicationTypeId: string): string {
    if (!this.applicationTypes || !applicationTypeId) {
      return '';
    }
    for (const applicationType of this.applicationTypes) {
      if (applicationType.id === applicationTypeId) {
        return applicationType.name + ' ' + applicationType.version;
      }
    }
    return null;
  }

  public resetFilters(): void {
    this.filters = new ApplicationFilters();
    this.filters.name = '';
    this.filters.owningDepartment = '';
    this.filters.isServiceApi = false;
    this.filters.applicationTypeId = '';
    this.applications = [];
    this.searchApplications();
  }
}
