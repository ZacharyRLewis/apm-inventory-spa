import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalService} from '@win-angular/services';
import {Application, ApplicationType} from '../../model';
import {DependencyService} from '../../services';
import {ApplicationTypeService} from '../../services/application-type/application-type.service';
import {ApplicationService} from '../../services/application/application.service';
import {ApplicationComponent} from '../application/application.component';
import {DependencyUploadComponent} from '../dependency/dependency-upload.component';
import {DeploymentComponent} from '../deployment/deployment.component';

@Component({
  selector: 'apm-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit  {

  public applications: Application[] = [];
  public applicationTypes: ApplicationType[] = [];
  public databaseTypes: ApplicationType[] = [];

  public APPLICATION_MODAL_ID = 'application-modal';
  public DEPLOYMENT_MODAL_ID = 'deployment-modal';
  public DEPENDENCY_UPLOAD_MODAL_ID = 'dependency-upload-modal';

  @ViewChild('applicationComponent')
  applicationComponent: ApplicationComponent;

  @ViewChild('deploymentComponent')
  deploymentComponent: DeploymentComponent;

  @ViewChild('dependencyUploadComponent')
  dependencyUploadComponent: DependencyUploadComponent;

  constructor(private applicationService: ApplicationService, private applicationTypeService: ApplicationTypeService,
              private modalService: ModalService, private dependencyService: DependencyService) {
    this.refreshApplications();
  }

  ngOnInit() {
    this.loadApplicationTypes();
  }

  public refreshApplications(): void {
    this.applicationService.findAll()
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

  public setPassedApplication(application: Application): void {
    this.applicationComponent.passedApplication = Object.assign({}, application);
    this.applicationComponent.model = Object.assign({}, application);
    this.applicationComponent.applicationTypes = this.applicationTypes;
    this.applicationComponent.loadDeployments();
    this.applicationComponent.loadDependencies();
  }

  public setPassedApplicationOnDeployment(application: Application): void {
    this.deploymentComponent.passedApplication = Object.assign({}, application);
    this.deploymentComponent.model.applicationId = application.id;
  }

  public setPassedApplicationOnDependencies(application: Application): void {
    this.dependencyUploadComponent.passedApplication = Object.assign({}, application);
  }

  public openModal(modalId: string): void {
    this.modalService.openModal(modalId);
  }

  public closeModal(modalId: string): void {
    this.modalService.closeModal(modalId);
  }

  public addDeploymentToApplication(application: Application): void {
    this.setPassedApplicationOnDeployment(application);
    this.closeModal(this.APPLICATION_MODAL_ID);
    this.openModal(this.DEPLOYMENT_MODAL_ID);
  }

  public openDependencyUploadDialog(application: Application): void {
    this.setPassedApplicationOnDependencies(application);
    this.closeModal(this.APPLICATION_MODAL_ID);
    this.openModal(this.DEPENDENCY_UPLOAD_MODAL_ID);
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

  public handleDeploymentCancel(application: Application): void {
    this.setPassedApplication(application);
    this.closeModal(this.DEPLOYMENT_MODAL_ID);
    this.openModal(this.APPLICATION_MODAL_ID);
  }

  public handleDeploymentCreate({application, deployment}): void {
    if (application.deployments) {
      application.deployments.push(deployment);
    } else {
      application.deployments = [deployment];
    }
    this.setPassedApplication(application);
    this.closeModal(this.DEPLOYMENT_MODAL_ID);
    this.openModal(this.APPLICATION_MODAL_ID);
  }

  public handleDependencyUploadCancel(application: Application): void {
    this.setPassedApplication(application);
    this.closeModal(this.DEPENDENCY_UPLOAD_MODAL_ID);
    this.openModal(this.APPLICATION_MODAL_ID);
  }

  public handleDependencyUpload(application: Application): void {
    this.setPassedApplication(application);
    this.closeModal(this.DEPENDENCY_UPLOAD_MODAL_ID);
    this.openModal(this.APPLICATION_MODAL_ID);
  }

  public loadApplicationTypes = () => {
    this.applicationTypeService.findAll()
      .subscribe(response => {
        this.applicationTypes = response.data;
      });
  }
}
