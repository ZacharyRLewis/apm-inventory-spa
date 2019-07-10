import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ChipsComponentModule} from '@win-angular/chips-component';
import {SelectComponentModule} from '@win-angular/select-component';
import {ModalService, ShareDataService} from '@win-angular/services';
import {cold, getTestScheduler} from 'jasmine-marbles';
import {AutoCompleteModule, ChipsModule, PanelModule, SidebarModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {ApplicationComponent, DeploymentBulkAddComponent, InventoryComponent} from '..';
import {Application, ApplicationFilters, ApplicationType, Deployment, HostServer, TestDomain, WinResponse} from '../../model';
import {
  ApplicationService,
  ApplicationTypeService,
  DatabaseService,
  DependencyService,
  DeploymentDatabaseService,
  DeploymentService,
  HostServerService,
  MulesoftApiService,
  PermissionsService
} from '../../services';
import {ApplicationFlyoutFilterComponent} from './application-flyout-filter.component';

class MockApplicationService extends ApplicationService {
  private response: WinResponse<Application[]> = {meta: null, data: [TestDomain.APPLICATION]};

  public findAll(): Observable<WinResponse<Application[]>> {
    return cold('--x|', {x: this.response});
  }
}

class MockApplicationTypeService extends ApplicationTypeService {
  private response: WinResponse<ApplicationType[]> = {meta: null, data: [TestDomain.APPLICATION_TYPE]};

  public findAll(): Observable<WinResponse<ApplicationType[]>> {
    return cold('--x|', {x: this.response});
  }
}

class MockHostServerService extends HostServerService {
  private response: WinResponse<HostServer[]> = {meta: null, data: [TestDomain.HOST_SERVER]};

  public findAll(): Observable<WinResponse<HostServer[]>> {
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

class MockShareDataService extends ShareDataService {
  blockUI(isBlockUI: boolean) {
    console.log('block ui = ' + isBlockUI);
  }
}

describe('InventoryComponent', () => {
  let component: InventoryComponent;
  let fixture: ComponentFixture<InventoryComponent>;
  let child: ApplicationComponent;
  let child2: DeploymentBulkAddComponent;
  let applicationService: ApplicationService;
  let applicationTypeService: ApplicationTypeService;
  let hostServerService: HostServerService;
  let modalService: ModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AutoCompleteModule, BrowserAnimationsModule, ChipsComponentModule, ChipsModule, FormsModule, HttpClientModule,
        HttpClientTestingModule, PanelModule, SelectComponentModule, SidebarModule, TableModule
      ],
      declarations: [InventoryComponent, ApplicationComponent, ApplicationFlyoutFilterComponent, DeploymentBulkAddComponent],
      providers: [
        {provide: ApplicationService, useClass: MockApplicationService},
        {provide: ApplicationTypeService, useClass: MockApplicationTypeService},
        {provide: HostServerService, useClass: MockHostServerService},
        DatabaseService, DeploymentService, DeploymentDatabaseService,
        DependencyService, MulesoftApiService, PermissionsService,
        {provide: ModalService, useClass: MockModalService},
        {provide: ShareDataService, useClass: MockShareDataService},
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryComponent);
    component = fixture.componentInstance;
    child = component.applicationComponent;
    child2 = component.deploymentBulkAddComponent;
    fixture.detectChanges();
    applicationService = TestBed.get(ApplicationService);
    applicationTypeService = TestBed.get(ApplicationTypeService);
    hostServerService = TestBed.get(HostServerService);
    modalService = TestBed.get(ModalService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch application list on init', () => {
    getTestScheduler().flush();

    expect(component.applications.length).toEqual(1);
    expect(component.applications).toContain(TestDomain.APPLICATION);
  });

  it('should fetch application types on init', () => {
    getTestScheduler().flush();

    expect(component.applicationTypes.length).toEqual(1);
    expect(component.applicationTypes).toContain(TestDomain.APPLICATION_TYPE);
  });

  it('should fetch host servers on init', () => {
    getTestScheduler().flush();

    expect(component.hostServers.length).toEqual(1);
    expect(component.hostServers).toContain(TestDomain.HOST_SERVER);
  });

  it('should reset application component when creating a new application', () => {
    component.resetApplicationComponent();

    expect(child.passedApplication).toBe(null);
    expect(child.model.id).toBe(null);
  });

  it('should set passed application in application component', () => {
    const application = TestDomain.APPLICATION;
    component.prepareApplicationModal(application);

    expect(child.passedApplication.id).toEqual(application.id);
    expect(child.model.id).toEqual(application.id);
  });

  it('should set passed application in deployment component', () => {
    const application = TestDomain.APPLICATION;
    component.prepareDeploymentBulkAddModal(application);

    expect(child2.passedApplication.id).toEqual(application.id);
  });

  it('should open modal', () => {
    spyOn(modalService, 'openModal').and.callThrough();

    component.openModal('application-modal');

    expect(modalService.openModal).toHaveBeenCalled();
  });

  it('should refresh applications on create event', () => {
    spyOn(component, 'loadApplications').and.callThrough();
    component.handleCreate(TestDomain.APPLICATION);

    expect(component.loadApplications).toHaveBeenCalled();
  });

  it('should refresh applications on delete event', () => {
    spyOn(component, 'loadApplications').and.callThrough();
    component.handleDelete(TestDomain.APPLICATION);

    expect(component.loadApplications).toHaveBeenCalled();
  });

  it('should refresh applications on update event', () => {
    spyOn(component, 'loadApplications').and.callThrough();
    component.handleUpdate(TestDomain.APPLICATION);

    expect(component.loadApplications).toHaveBeenCalled();
  });

  it('should handle deployment cancel event', () => {
    spyOn(component, 'prepareApplicationModal').and.callThrough();
    spyOn(modalService, 'openModal').and.callThrough();
    spyOn(modalService, 'closeModal').and.callThrough();
    component.handleBulkDeploymentCancel(TestDomain.APPLICATION);

    expect(component.prepareApplicationModal).toHaveBeenCalled();
    expect(modalService.openModal).toHaveBeenCalled();
    expect(modalService.closeModal).toHaveBeenCalled();
  });

  it('should handle deployment create event', () => {
    const application: Application = TestDomain.APPLICATION;
    const deployments: Deployment[] = [TestDomain.DEPLOYMENT];

    spyOn(component, 'prepareApplicationModal').and.callThrough();
    spyOn(modalService, 'openModal').and.callThrough();
    spyOn(modalService, 'closeModal').and.callThrough();
    component.handleBulkDeploymentCreate({application, deployments});

    expect(component.prepareApplicationModal).toHaveBeenCalled();
    expect(modalService.openModal).toHaveBeenCalled();
    expect(modalService.closeModal).toHaveBeenCalled();
  });

  it('should search applications with filters', () => {
    spyOn(applicationService, 'filterAll').and.callThrough();

    const applicationFilters = new ApplicationFilters('test', 'test', true, '1');
    const params = [
      {name: 'name', value: 'test'},
      {name: 'owningDepartment', value: 'test'},
      {name: 'isServiceApi', value: true},
      {name: 'applicationTypeId', value: '1'}
    ];
    component.filters = applicationFilters;
    component.searchApplications();

    expect(applicationService.filterAll).toHaveBeenCalledWith(params);
  });

  it('should handle bulk deployment cancel', () => {
    spyOn(component, 'prepareApplicationModal').and.callThrough();
    spyOn(component, 'closeModal').and.callThrough();
    spyOn(component, 'openModal').and.callThrough();

    const application = TestDomain.APPLICATION;
    component.handleBulkDeploymentCancel(application);

    expect(component.prepareApplicationModal).toHaveBeenCalledWith(application);
    expect(component.closeModal).toHaveBeenCalledTimes(1);
    expect(component.openModal).toHaveBeenCalledTimes(1);
  });

  it('should handle bulk deployment create without existing deployments', () => {
    const application = TestDomain.APPLICATION;
    const deployments = [new Deployment('1'), new Deployment('2')];
    component.applicationComponent.deployments = [];
    component.handleBulkDeploymentCreate({application, deployments});

    expect(component.applicationComponent.deployments.length).toEqual(2);
  });

  it('should handle bulk deployment create with existing deployments', () => {
    const application = TestDomain.APPLICATION;
    const deployments = [new Deployment('1'), new Deployment('2')];
    component.applicationComponent.deployments = [TestDomain.DEPLOYMENT];
    component.handleBulkDeploymentCreate({application, deployments});

    expect(component.applicationComponent.deployments.length).toEqual(3);
  });
});
