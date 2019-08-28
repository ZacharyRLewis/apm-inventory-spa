import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ModalService, ShareDataService} from '@win-angular/services';
import {Application, ApplicationWorkflow, ApplicationWorkflowStatus, Database, GithubRepository, GithubTeam, Permissions} from '../../model';
import {ApplicationWorkflowQuestions} from '../../model/application-workflow-questions';
import {GithubRepositoryService} from '../../services';

@Component({
  selector: 'apm-application-workflow',
  templateUrl: './application-workflow.component.html',
  styleUrls: ['./application-workflow.component.scss']
})
export class ApplicationWorkflowComponent {

  @Input() modalId: string;
  @Input() applicationWorkflowStatuses: ApplicationWorkflowStatus[] = [];
  @Input() teams: GithubTeam[] = [];
  @Input() permissions: Permissions;

  @Output() createEvent: EventEmitter<ApplicationWorkflow> = new EventEmitter<ApplicationWorkflow>();
  @Output() deleteEvent: EventEmitter<ApplicationWorkflow> = new EventEmitter<ApplicationWorkflow>();
  @Output() updateEvent: EventEmitter<ApplicationWorkflow> = new EventEmitter<ApplicationWorkflow>();

  public model: ApplicationWorkflow = new ApplicationWorkflow();
  public passedWorkflow: ApplicationWorkflow;
  public questions: ApplicationWorkflowQuestions;
  public repository: GithubRepository;
  public applicationLayers = ['User Interface', 'Service/API', 'Batch', 'Other'];

  // Panel controls
  public collapseGeneralInfoPanel = false;
  public collapseSourceCodePanel = false;
  public collapseArchitecturePanel = false;

  @ViewChild('applicationWorkflowForm')
  public applicationWorkflowForm;

  constructor(private modalService: ModalService, private githubRepoService: GithubRepositoryService, private shareDataService: ShareDataService) {
    this.setDefaultValues();
  }

  public setDefaultValues(): void {
    this.model.id = null;
    this.model.applicationId = null;
    this.model.workflowStatusId = null;
    this.model.applicationClass = '';
    this.model.repositoryName = '';
    this.model.repositoryTeam = '';
    this.model.application = new Application();
    this.questions = new ApplicationWorkflowQuestions();
  }

  public closeModal(): void {
    this.modalService.closeModal(this.modalId);
    this.applicationWorkflowForm.resetForm();
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

  public createRepository(): void {
    const repository: GithubRepository = new GithubRepository(0, this.questions.repoName);
    repository.teams = [this.questions.githubTeam];

    console.log('team: ' + JSON.stringify(this.questions.githubTeam));

    this.githubRepoService.create(repository)
      .subscribe(res => {
          this.model.application.repository = res.data.html_url;
          this.model.application.defaultBranch = res.data.default_branch;
          this.questions.repoExists = 'Yes';
          this.questions.needsRepo = 'No';
        },
        err => {
          this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(create repository) >> ' + err.message}]);
        });
  }

  public emailArchitecture(): void {
    const address = 'zrlewis@winsupplyinc.com';
  }
}
