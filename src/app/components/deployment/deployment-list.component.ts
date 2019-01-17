import {Component, OnInit, ViewChild} from '@angular/core';
import {Application, Deployment} from '../../model';
import {ApplicationService} from '../../services';
import {DeploymentService} from '../../services/deployment/deployment.service';
import {DeploymentComponent} from './deployment.component';
import {CarouselService, ModalService} from '@win-angular/services';

@Component({
  selector: 'apm-deployment-list',
  templateUrl: './deployment-list.component.html',
  styleUrls: ['./deployment-list.component.scss']
})
export class DeploymentListComponent implements OnInit  {

  public deployments: Deployment[] = [];
  public applications: Application[] = [];

  public DEPLOYMENT_MODAL_ID = 'deployment-modal';

  @ViewChild('deploymentComponent')
  deploymentComponent: DeploymentComponent;

  constructor(private applicationService: ApplicationService, private deploymentService: DeploymentService,
              private modalService: ModalService, private carouselService: CarouselService) {
    this.refreshDeployments();
  }

  ngOnInit() {
    this.loadApplications();
  }

  public refreshDeployments(): void {
    this.deploymentService.findAll()
      .subscribe(response => {
        this.deployments = response.data;
      });
  }

  public resetDeploymentComponent(): void {
    this.deploymentComponent.passedDeployment = null;
    this.deploymentComponent.setDefaultValues();
  }

  public setPassedDeployment(deployment: Deployment): void {
    this.deploymentComponent.passedDeployment = Object.assign({}, deployment);
    this.deploymentComponent.model = Object.assign({}, deployment);
  }

  public openModal(): void {
    this.deploymentComponent.applications = this.applications;
    this.carouselService.first(this.DEPLOYMENT_MODAL_ID);
    this.modalService.openModal(this.DEPLOYMENT_MODAL_ID);
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

  loadApplications = () => {
    this.applicationService.findAll()
      .subscribe(response => {
        this.applications = response.data;
      });
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
