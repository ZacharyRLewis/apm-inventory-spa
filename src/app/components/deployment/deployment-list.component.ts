import {Component, OnInit, ViewChild} from '@angular/core';
import {Application} from '../../model';
import {Deployment} from '../../model/index';
import {DeploymentService} from '../../services/deployment/deployment.service';
import {ApplicationService, ModalService} from '../../services/index';
import {DeploymentComponent} from './deployment.component';

@Component({
  selector: 'apm-deployment-list',
  templateUrl: './deployment-list.component.html',
  styleUrls: ['./deployment-list.component.scss']
})
export class DeploymentListComponent implements OnInit  {

  public deployments: Deployment[] = [];
  public applications: Application[] = [];

  @ViewChild('deploymentComponent')
  deploymentComponent: DeploymentComponent;

  constructor(private applicationService: ApplicationService, private deploymentService: DeploymentService, private modalService: ModalService) {
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
    this.modalService.open('deployment-component');
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
}
