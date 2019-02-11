import {Component, OnInit, ViewChild} from '@angular/core';
import {Application, Deployment} from '../../model';
import {ApplicationService} from '../../services';
import {DeploymentService} from '../../services/deployment/deployment.service';
import {DeploymentDatabaseComponent} from '../database/deployment-database.component';
import {DeploymentComponent} from './deployment.component';
import {ModalService} from '@win-angular/services';

@Component({
  selector: 'apm-deployment-list',
  templateUrl: './deployment-list.component.html',
  styleUrls: ['./deployment-list.component.scss']
})
export class DeploymentListComponent implements OnInit  {

  public deployments: Deployment[] = [];
  public applications: Application[] = [];

  public DEPLOYMENT_MODAL_ID = 'deployment-modal';
  public DEPLOYMENT_DATABASE_MODAL_ID = 'deployment-database-modal';

  @ViewChild('deploymentComponent')
  deploymentComponent: DeploymentComponent;

  @ViewChild('deploymentDatabaseComponent')
  deploymentDatabaseComponent: DeploymentDatabaseComponent;

  constructor(private applicationService: ApplicationService, private deploymentService: DeploymentService,
              private modalService: ModalService) {
    this.refreshDeployments();
  }

  ngOnInit() {
    this.loadApplications();
  }

  public loadApplications = () => {
    this.applicationService.findAll()
      .subscribe(response => {
        this.applications = response.data;
      });
  }

  public refreshDeployments(): void {
    this.deploymentService.findAll()
      .subscribe(response => {
        this.deployments = response.data;
      });
  }

  public resetDeploymentComponent(): void {
    this.deploymentComponent.passedDeployment = null;
    this.deploymentComponent.applications = this.applications;
    this.deploymentComponent.setDefaultValues();
  }

  public setPassedDeployment(deployment: Deployment): void {
    this.deploymentComponent.passedDeployment = Object.assign({}, deployment);
    this.deploymentComponent.model = Object.assign({}, deployment);
    this.deploymentComponent.applications = this.applications;
    this.deploymentComponent.loadDatabases();
    this.deploymentComponent.loadDeploymentDatabases();
    this.deploymentComponent.loadApis(deployment.contextName);
  }

  public setPassedDeploymentOnDatabases(deployment: Deployment): void {
    this.deploymentDatabaseComponent.passedDeployment = Object.assign({}, deployment);
  }

  public openModal(modalId: string): void {
    this.modalService.openModal(modalId);
  }

  public closeModal(modalId: string): void {
    this.modalService.closeModal(modalId);
  }

  public handleCreate(deployment: Deployment): void {
    console.log('Deployment ' + Deployment.getBaseUrl(deployment) + ' successfully created');
    this.refreshDeployments();
  }

  public handleDelete(deployment: Deployment): void {
    console.log('Deployment ' + Deployment.getBaseUrl(deployment) + ' successfully deleted');
    this.refreshDeployments();
  }

  public handleUpdate(deployment: Deployment): void {
    console.log('Deployment ' + Deployment.getBaseUrl(deployment) + ' successfully updated');
    this.refreshDeployments();
  }

  public handleDeploymentDatabaseCancel(deployment: Deployment): void {
    this.setPassedDeployment(deployment);
    this.closeModal(this.DEPLOYMENT_DATABASE_MODAL_ID);
    this.openModal(this.DEPLOYMENT_MODAL_ID);
  }

  public handleDeploymentDatabaseCreate(deployment: Deployment): void {
    this.setPassedDeployment(deployment);
    this.closeModal(this.DEPLOYMENT_DATABASE_MODAL_ID);
    this.openModal(this.DEPLOYMENT_MODAL_ID);
  }

  public addDatabaseToDeployment(deployment: Deployment): void {
    this.deploymentDatabaseComponent.loadDatabases();
    this.setPassedDeploymentOnDatabases(deployment);
    this.closeModal(this.DEPLOYMENT_MODAL_ID);
    this.openModal(this.DEPLOYMENT_DATABASE_MODAL_ID);
  }

  public getAppMnemonic(applicationId: string): string {
    if (!this.applications || !applicationId) {
      return '';
    }
    for (const application of this.applications) {
      if (application.id === applicationId) {
        return application.mnemonic;
      }
    }
    return null;
  }

  public getDeploymentBaseUrl(deployment: Deployment): string {
    return Deployment.getBaseUrl(deployment);
  }
}
