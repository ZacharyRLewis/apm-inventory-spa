import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalService} from '@win-angular/services';
import {Application, ApplicationType, HostServer} from '../../model';
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
export class InventoryComponent implements OnInit  {

  public applications: Application[] = [];
  public applicationTypes: ApplicationType[] = [];
  public hostServers: HostServer[] = [];
  public filters = new ApplicationFilters();

  public APPLICATION_MODAL_ID = 'application-modal';
  public DEPLOYMENT_BULK_ADD_MODAL_ID = 'deployment-bulk-add-modal';

  public columns = [
    {field: 'mnemonic', header: 'Mnemonic', width: '100px'},
    {field: 'description', header: 'Description', width: '150px'},
    {field: 'applicationTypeId', header: 'Type', width: '100px'}
  ];

  @ViewChild('applicationComponent')
  applicationComponent: ApplicationComponent;

  @ViewChild('deploymentBulkAddComponent')
  deploymentBulkAddComponent: DeploymentBulkAddComponent;

  constructor(private applicationService: ApplicationService, private applicationTypeService: ApplicationTypeService,
              private modalService: ModalService, private hostServerService: HostServerService) {
    this.refreshApplications();
  }

  ngOnInit() {
    this.loadApplicationTypes();
    this.loadHostServers();
  }

  public refreshApplications(): void {
    this.applicationService.findAll()
      .subscribe(response => {
        this.applications = response.data;
      });
  }

  public searchApplications(): void {
    const params = [];

    if (this.filters.mnemonic) {
      params.push({name: 'mnemonic', value: this.filters.mnemonic});
    }

    if (this.filters.isServiceApi) {
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
    console.log('Application ' + application.mnemonic + ' successfully created');
    this.refreshApplications();
  }

  public handleDelete(application: Application): void {
    console.log('Application ' + application.mnemonic + ' successfully deleted');
    this.refreshApplications();
  }

  public handleUpdate(application: Application): void {
    console.log('Application ' + application.mnemonic + ' successfully updated');
    this.refreshApplications();
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
    this.filters.isServiceApi = false;
    this.filters.applicationTypeId = '';
    this.applications = [];
    this.searchApplications();
  }
}
