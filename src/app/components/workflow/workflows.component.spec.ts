import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ModalService, ShareDataService} from '@win-angular/services';
import {cold, getTestScheduler} from 'jasmine-marbles';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {ApplicationWorkflowComponent, WorkflowsComponent} from '..';
import {ApplicationWorkflow, ApplicationWorkflowStatus, GithubTeam, Permissions, TestDomain, WinResponse} from '../../model';
import {
  ApplicationService,
  ApplicationWorkflowService,
  ApplicationWorkflowStatusService,
  DeploymentDatabaseService,
  DeploymentService,
  GithubTeamService,
  PermissionsService
} from '../../services';

class MockApplicationWorkflowService extends ApplicationWorkflowService {
  private response: WinResponse<ApplicationWorkflow[]> = {meta: null, data: [TestDomain.APPLICATION_WORKFLOW]};

  public findAll(): Observable<WinResponse<ApplicationWorkflow[]>> {
    return cold('--x|', {x: this.response});
  }
}

class MockApplicationWorkflowStatusService extends ApplicationWorkflowStatusService {
  private response: WinResponse<ApplicationWorkflowStatus[]> = {meta: null, data: [TestDomain.APPLICATION_WORKFLOW_STATUS]};

  public findAll(): Observable<WinResponse<ApplicationWorkflowStatus[]>> {
    return cold('--x|', {x: this.response});
  }
}

class MockGithubTeamService extends GithubTeamService {
  private response: WinResponse<GithubTeam[]> = {meta: null, data: [TestDomain.GITHUB_TEAM]};

  public findAll(): Observable<WinResponse<GithubTeam[]>> {
    return cold('--x|', {x: this.response});
  }
}

class MockModalService extends ModalService {
  openModal(modalId: string, hideFocus?: boolean) {
    console.log('open modal');
  }

  closeModal(modalId: string) {
    console.log('close modal');
  }
}

class MockPermissionsService extends PermissionsService {
  private response: WinResponse<Permissions> = {meta: null, data: TestDomain.PERMISSIONS};

  public findUserPermissions(): Observable<WinResponse<Permissions>> {
    return cold('--x|', {x: this.response});
  }
}

describe('WorkflowsComponent', () => {
  let component: WorkflowsComponent;
  let fixture: ComponentFixture<WorkflowsComponent>;
  let child: ApplicationWorkflowComponent;
  let modalService: ModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, HttpClientTestingModule, TableModule],
      declarations: [WorkflowsComponent, ApplicationWorkflowComponent],
      providers: [
        ApplicationService, DeploymentService, DeploymentDatabaseService,
        {provide: ApplicationWorkflowService, useClass: MockApplicationWorkflowService},
        {provide: ApplicationWorkflowStatusService, useClass: MockApplicationWorkflowStatusService},
        {provide: GithubTeamService, useClass: MockGithubTeamService},
        {provide: ModalService, useClass: MockModalService},
        {provide: PermissionsService, useClass: MockPermissionsService},
        ShareDataService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowsComponent);
    component = fixture.componentInstance;
    child = component.applicationWorkflowComponent;
    fixture.detectChanges();
    modalService = TestBed.get(ModalService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch applicationWorkflow list on init', () => {
    getTestScheduler().flush();

    expect(component.applicationWorkflows.length).toEqual(1);
    expect(component.applicationWorkflows).toContain(TestDomain.APPLICATION_WORKFLOW);
  });

  it('should fetch applicationWorkflowStatus list on init', () => {
    getTestScheduler().flush();

    expect(component.applicationWorkflowStatuses.length).toEqual(1);
    expect(component.applicationWorkflowStatuses).toContain(TestDomain.APPLICATION_WORKFLOW_STATUS);
  });

  it('should fetch github teams on init', () => {
    getTestScheduler().flush();

    expect(component.teams.length).toEqual(1);
    expect(component.teams).toContain(TestDomain.GITHUB_TEAM);
  });

  it('should reset applicationWorkflow component when creating a new applicationWorkflow', () => {
    component.resetApplicationWorkflowComponent();

    expect(child.passedWorkflow).toBe(null);
    expect(child.model.id).toBe(null);
  });

  it('should set passed applicationWorkflow in applicationWorkflow component', () => {
    const applicationWorkflow = TestDomain.APPLICATION_WORKFLOW;
    component.prepareApplicationWorkflowModal(applicationWorkflow);

    expect(child.passedWorkflow.id).toEqual(applicationWorkflow.id);
    expect(child.model.id).toEqual(applicationWorkflow.id);
  });

  it('should open applicationWorkflow modal', () => {
    spyOn(modalService, 'openModal').and.callThrough();

    component.openApplicationWorkflowModal();

    expect(modalService.openModal).toHaveBeenCalled();
  });

  it('should refresh applicationWorkflows on create event', () => {
    spyOn(component, 'refreshApplicationWorkflows').and.callThrough();
    component.handleApplicationWorkflowCreate(TestDomain.APPLICATION_WORKFLOW);

    expect(component.refreshApplicationWorkflows).toHaveBeenCalled();
  });

  it('should refresh applicationWorkflows on delete event', () => {
    spyOn(component, 'refreshApplicationWorkflows').and.callThrough();
    component.handleApplicationWorkflowDelete(TestDomain.APPLICATION_TYPE);

    expect(component.refreshApplicationWorkflows).toHaveBeenCalled();
  });

  it('should refresh applicationWorkflows on update event', () => {
    spyOn(component, 'refreshApplicationWorkflows').and.callThrough();
    component.handleApplicationWorkflowUpdate(TestDomain.APPLICATION_TYPE);

    expect(component.refreshApplicationWorkflows).toHaveBeenCalled();
  });
});
