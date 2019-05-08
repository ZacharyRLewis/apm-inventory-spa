import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalService, ShareDataService} from '@win-angular/services';
import {Application, ApplicationType, HostServer, SelectOption} from '../../model';
import {ApplicationFilters} from '../../model/application-filters';
import {HostServerService} from '../../services';
import {ApplicationTypeService} from '../../services/application-type/application-type.service';
import {ApplicationService} from '../../services/application/application.service';
import {ApplicationComponent} from '../application/application.component';
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
  public departments: SelectOption[] = [];
  public filters = new ApplicationFilters();

  public APPLICATION_MODAL_ID = 'application-modal';
  public DEPLOYMENT_BULK_ADD_MODAL_ID = 'deployment-bulk-add-modal';

  public columns = [
    {field: 'mnemonic', header: 'Mnemonic', width: '100px'},
    {field: 'owningDepartment', header: 'Department', width: '100px'},
    {field: 'description', header: 'Description', width: '150px'},
    {field: 'applicationTypeId', header: 'Type', width: '100px'}
  ];

  @ViewChild('applicationComponent')
  applicationComponent: ApplicationComponent;

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
        if (application.owningDepartment === department.key) {
          existsInList = true;
          break;
        }
      }

      if (application.owningDepartment && !existsInList) {
        this.departments.push(new SelectOption(application.owningDepartment, application.owningDepartment));
      }
    }
  }

  public searchApplications(): void {
    const params = [];

    if (this.filters.mnemonic) {
      params.push({name: 'mnemonic', value: this.filters.mnemonic});
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

  public prepareApplicationModal(application: Application): void {
    this.applicationComponent.passedApplication = Object.assign({}, application);
    this.applicationComponent.model = Object.assign({}, application);
    this.applicationComponent.loadDeployments();
    this.applicationComponent.loadDependencies();
  }

  public prepareDeploymentBulkAddModal(application: Application): void {
    this.deploymentBulkAddComponent.passedApplication = Object.assign({}, application);
  }

  public openModal(modalId: string): void {
    this.modalService.openModal(modalId);
  }

  public closeModal(modalId: string): void {
    this.modalService.closeModal(modalId);
  }

  public addDeploymentToApplication(application: Application): void {
    this.prepareDeploymentBulkAddModal(application);
    this.closeModal(this.APPLICATION_MODAL_ID);
    this.openModal(this.DEPLOYMENT_BULK_ADD_MODAL_ID);
  }

  public handleCreate(application: Application): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Application ' + application.mnemonic + ' successfully created'}]);
    this.loadApplications();
  }

  public handleDelete(application: Application): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Application ' + application.mnemonic + ' successfully deleted'}]);
    this.loadApplications();
  }

  public handleUpdate(application: Application): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Application ' + application.mnemonic + ' successfully updated'}]);
    this.loadApplications();
  }

  public handleBulkDeploymentCancel(application: Application): void {
    this.prepareApplicationModal(application);
    this.closeModal(this.DEPLOYMENT_BULK_ADD_MODAL_ID);
    this.openModal(this.APPLICATION_MODAL_ID);
  }

  public handleBulkDeploymentCreate({application, deployments}): void {
    this.prepareApplicationModal(application);

    if (!this.applicationComponent.deployments) {
      this.applicationComponent.deployments = deployments;
    } else {
      this.applicationComponent.deployments = [...this.applicationComponent.deployments, ...deployments];
    }

    this.closeModal(this.DEPLOYMENT_BULK_ADD_MODAL_ID);
    this.openModal(this.APPLICATION_MODAL_ID);
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

  public resetFilters(event?): void {
    this.filters = new ApplicationFilters();
    this.filters.mnemonic = '';
    this.filters.owningDepartment = '';
    this.filters.isServiceApi = false;
    this.filters.applicationTypeId = '';
    this.applications = [];
    this.searchApplications();
  }
}
