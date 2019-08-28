import {Component, ViewChild} from '@angular/core';
import {ModalService, ShareDataService} from '@win-angular/services';
import {ApplicationWorkflow, ApplicationWorkflowStatus, GithubTeam, Permissions} from '../../model';
import {ApplicationWorkflowService, GithubTeamService, PermissionsService} from '../../services';
import {ApplicationWorkflowStatusService} from '../../services/application-workflow-status/application-workflow-status.service';
import {ApplicationWorkflowComponent} from './application-workflow.component';

@Component({
  selector: 'apm-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.scss']
})
export class WorkflowsComponent {

  public selectedTab = 0;
  public tabNames = ['Applications'];

  public applicationWorkflows: ApplicationWorkflow[] = [];
  public applicationWorkflowStatuses: ApplicationWorkflowStatus[] = [];
  public teams: GithubTeam[] = [];
  public permissions: Permissions;

  public readonly APPLICATION_WORKFLOW_MODAL_ID = 'application-workflow-modal';

  public applicationWorkflowColumns = [
    {field: 'id', header: 'Id', width: '50px'},
    {field: 'applicationId', header: 'Application', width: '100px'},
    {field: 'workflowStatusId', header: 'Status', width: '100px'},
    {field: 'description', header: 'Description', width: '150px'}
  ];

  @ViewChild('applicationWorkflowComponent')
  applicationWorkflowComponent: ApplicationWorkflowComponent;

  constructor(private applicationWorkflowService: ApplicationWorkflowService, private modalService: ModalService,
              private applicationWorkflowStatusService: ApplicationWorkflowStatusService, private githubTeamService: GithubTeamService,
              private shareDataService: ShareDataService, private permissionsService: PermissionsService) {
    this.refreshApplicationWorkflows();
    this.refreshApplicationWorkflowStatuses();
    this.refreshTeams();
    this.permissionsService.findUserPermissions()
      .subscribe(response => {
        this.permissions = response.data;
      });
  }

  public toggleTabs(tab: number): void {
    this.selectedTab = tab;
  }

  public refreshApplicationWorkflows(): void {
    this.applicationWorkflowService.findAll()
      .subscribe(response => {
        this.applicationWorkflows = response.data;
      });
  }

  public refreshApplicationWorkflowStatuses(): void {
    this.applicationWorkflowStatusService.findAll()
      .subscribe(response => {
        this.applicationWorkflowStatuses = response.data;
      });
  }

  public refreshTeams(): void {
    this.githubTeamService.findAll()
      .subscribe(response => {
        this.teams = response.data.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      });
  }

  public prepareApplicationWorkflowModal(applicationWorkflow: ApplicationWorkflow): void {
    this.applicationWorkflowComponent.passedWorkflow = Object.assign({}, applicationWorkflow);
    this.applicationWorkflowComponent.model = Object.assign({}, applicationWorkflow);
  }

  public openApplicationWorkflowModal(): void {
    history.pushState(null, null, document.URL);
    this.modalService.openModal(this.APPLICATION_WORKFLOW_MODAL_ID);
    this.modalService.registerPopState(this.applicationWorkflowComponent.backButtonCallback);
  }

  public resetApplicationWorkflowComponent(): void {
    this.applicationWorkflowComponent.passedWorkflow = null;
    this.applicationWorkflowComponent.setDefaultValues();
  }

  public handleApplicationWorkflowCreate(applicationWorkflow: ApplicationWorkflow): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Application Workflow ' + applicationWorkflow.id + ' successfully created'}]);
    this.refreshApplicationWorkflows();
  }

  public handleApplicationWorkflowDelete(applicationWorkflow: ApplicationWorkflow): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Application Workflow ' + applicationWorkflow.id + ' successfully deleted'}]);
    this.refreshApplicationWorkflows();
  }

  public handleApplicationWorkflowUpdate(applicationWorkflow: ApplicationWorkflow): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Application Workflow ' + applicationWorkflow.id + ' successfully updated'}]);
    this.refreshApplicationWorkflows();
  }
}
