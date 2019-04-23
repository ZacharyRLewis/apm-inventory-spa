import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ChipsComponentModule} from '@win-angular/chips-component';
import {SelectComponentModule} from '@win-angular/select-component';
import {ModalService, ShareDataService} from '@win-angular/services';
import {cold, getTestScheduler} from 'jasmine-marbles';
import {AutoCompleteModule, SidebarModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {ApplicationComponent, DeploymentBulkAddComponent, InventoryComponent} from '..';
import {Application, ApplicationFilters, Deployment, TestDomain, WinResponse} from '../../model';
import {
  ApplicationService,
  ApplicationTypeService,
  DatabaseService,
  DependencyService,
  DeploymentDatabaseService,
  DeploymentService,
  HostServerService,
  MulesoftApiService
} from '../../services';
import {ApplicationFlyoutFilterComponent} from './application-flyout-filter.component';

class MockApplicationService extends ApplicationService {
  private response: WinResponse<Application[]> = {meta: null, data: [TestDomain.APPLICATION]};

  public findAll(): Observable<WinResponse<Application[]>> {
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
  let modalService: ModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AutoCompleteModule, BrowserAnimationsModule, ChipsComponentModule, FormsModule, HttpClientModule,
        HttpClientTestingModule, SelectComponentModule, SidebarModule, TableModule
      ],
      declarations: [InventoryComponent, ApplicationComponent, ApplicationFlyoutFilterComponent, DeploymentBulkAddComponent],
      providers: [
        {provide: ApplicationService, useClass: MockApplicationService},
        ApplicationTypeService, DatabaseService, DeploymentService, DeploymentDatabaseService,
        DependencyService, HostServerService, MulesoftApiService,
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
    spyOn(component, 'refreshApplications').and.callThrough();
    component.handleCreate(TestDomain.APPLICATION);

    expect(component.refreshApplications).toHaveBeenCalled();
  });

  it('should refresh applications on delete event', () => {
    spyOn(component, 'refreshApplications').and.callThrough();
    component.handleDelete(TestDomain.APPLICATION);

    expect(component.refreshApplications).toHaveBeenCalled();
  });

  it('should refresh applications on update event', () => {
    spyOn(component, 'refreshApplications').and.callThrough();
    component.handleUpdate(TestDomain.APPLICATION);

    expect(component.refreshApplications).toHaveBeenCalled();
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

    const applicationFilters = new ApplicationFilters('test', true, '1');
    const params = [
      {name: 'mnemonic', value: 'test'},
      {name: 'isServiceApi', value: true},
      {name: 'applicationTypeId', value: '1'}
    ];
    component.filters = applicationFilters;
    component.searchApplications();

    expect(applicationService.filterAll).toHaveBeenCalledWith(params);
  });
});
