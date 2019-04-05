import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ChipsComponentModule} from '@win-angular/chips-component';
import {SelectComponentModule} from '@win-angular/select-component';
import {ModalService} from '@win-angular/services';
import {cold, getTestScheduler} from 'jasmine-marbles';
import {SidebarModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {DeploymentComponent, DeploymentListComponent} from '..';
import {Deployment, DeploymentFilters, TestDomain, WinResponse} from '../../model';
import {
  ApplicationService,
  DatabaseService,
  DeploymentDatabaseService,
  DeploymentService,
  HostServerService,
  MulesoftApiService
} from '../../services';
import {DeploymentDatabaseComponent} from './deployment-database.component';
import {DeploymentFlyoutFilterComponent} from './deployment-flyout-filter.component';

class MockDeploymentService extends DeploymentService {
  private response: WinResponse<Deployment[]> = {meta: null, data: [TestDomain.DEPLOYMENT]};

  public findAll(): Observable<WinResponse<Deployment[]>> {
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

describe('DeploymentListComponent', () => {
  let component: DeploymentListComponent;
  let fixture: ComponentFixture<DeploymentListComponent>;
  let child: DeploymentComponent;
  let deploymentService: DeploymentService;
  let modalService: ModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule, BrowserAnimationsModule, HttpClientModule, HttpClientTestingModule, TableModule,
        ChipsComponentModule, SelectComponentModule, SidebarModule
      ],
      declarations: [DeploymentListComponent, DeploymentComponent, DeploymentDatabaseComponent, DeploymentFlyoutFilterComponent],
      providers: [
        {provide: DeploymentService, useClass: MockDeploymentService},
        ApplicationService, DatabaseService, DeploymentDatabaseService, HostServerService, MulesoftApiService,
        {provide: ModalService, useClass: MockModalService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentListComponent);
    component = fixture.componentInstance;
    child = component.deploymentComponent;
    fixture.detectChanges();
    deploymentService = TestBed.get(DeploymentService);
    modalService = TestBed.get(ModalService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch deployment list on init', () => {
    getTestScheduler().flush();

    expect(component.deployments.length).toEqual(1);
    expect(component.deployments).toContain(TestDomain.DEPLOYMENT);
  });

  it('should reset deployment component when creating a new deployment', () => {
    component.resetDeploymentComponent();

    expect(child.passedDeployment).toBe(null);
    expect(child.model.id).toBe(null);
  });

  it('should set passed deployment in deployment component', () => {
    const deployment = TestDomain.DEPLOYMENT;
    component.setPassedDeployment(deployment);

    expect(child.passedDeployment.id).toEqual(deployment.id);
    expect(child.model.id).toEqual(deployment.id);
  });

  it('should open modal', () => {
    spyOn(modalService, 'openModal').and.callThrough();

    component.openModal('deployment-modal');

    expect(modalService.openModal).toHaveBeenCalled();
  });

  it('should refresh deployments on create event', () => {
    spyOn(component, 'refreshDeployments').and.callThrough();
    component.handleCreate(TestDomain.DEPLOYMENT);

    expect(component.refreshDeployments).toHaveBeenCalled();
  });

  it('should refresh deployments on delete event', () => {
    spyOn(component, 'refreshDeployments').and.callThrough();
    component.handleDelete(TestDomain.DEPLOYMENT);

    expect(component.refreshDeployments).toHaveBeenCalled();
  });

  it('should refresh deployments on update event', () => {
    spyOn(component, 'refreshDeployments').and.callThrough();
    component.handleUpdate(TestDomain.DEPLOYMENT);

    expect(component.refreshDeployments).toHaveBeenCalled();
  });

  it('should handle deployment database create', () => {
    spyOn(component, 'setPassedDeployment').and.callThrough();
    spyOn(modalService, 'closeModal').and.callThrough();
    spyOn(modalService, 'openModal').and.callThrough();

    const deployment: Deployment = TestDomain.DEPLOYMENT;

    component.handleDeploymentDatabaseCreate(deployment);

    expect(component.setPassedDeployment).toHaveBeenCalledWith(deployment);
    expect(modalService.closeModal).toHaveBeenCalledWith(component.DEPLOYMENT_DATABASE_MODAL_ID);
    expect(modalService.openModal).toHaveBeenCalledWith(component.DEPLOYMENT_MODAL_ID);
  });

  it('should handle deployment database cancel', () => {
    spyOn(component, 'setPassedDeployment').and.callThrough();
    spyOn(modalService, 'closeModal').and.callThrough();
    spyOn(modalService, 'openModal').and.callThrough();

    const deployment: Deployment = TestDomain.DEPLOYMENT;

    component.handleDeploymentDatabaseCancel(deployment);

    expect(component.setPassedDeployment).toHaveBeenCalledWith(deployment);
    expect(modalService.closeModal).toHaveBeenCalledWith(component.DEPLOYMENT_DATABASE_MODAL_ID);
    expect(modalService.openModal).toHaveBeenCalledWith(component.DEPLOYMENT_MODAL_ID);
  });

  it('should get app mnemonic correctly', () => {
    component.applications = null;
    const appMnemonic1: string = component.getAppMnemonic('123');

    expect(appMnemonic1).toEqual('');

    component.applications = [TestDomain.APPLICATION];
    const appMnemonic2: string = component.getAppMnemonic(null);

    expect(appMnemonic2).toEqual('');

    component.applications = [TestDomain.APPLICATION];
    const appMnemonic3: string = component.getAppMnemonic('123');

    expect(appMnemonic3).toEqual('test');
  });

  it('should get host server name correctly', () => {
    component.hostServers = null;
    const hostServerName1: string = component.getHostServerName('123');

    expect(hostServerName1).toEqual('');

    component.hostServers = [TestDomain.HOST_SERVER];
    const hostServerName2: string = component.getHostServerName(null);

    expect(hostServerName2).toEqual('');

    component.hostServers = [TestDomain.HOST_SERVER];
    const hostServerName3: string = component.getHostServerName('123');

    expect(hostServerName3).toEqual('localhost');
  });

  it('should search deployments with filters', () => {
    spyOn(deploymentService, 'filterAll').and.callThrough();

    const deploymentFilters = new DeploymentFilters('1', 'DEV', '1');
    const params = [
      {name: 'applicationId', value: '1'},
      {name: 'environment', value: 'DEV'},
      {name: 'hostServerId', value: '1'}
    ];
    component.filters = deploymentFilters;
    component.searchDeployments();

    expect(deploymentService.filterAll).toHaveBeenCalledWith(params);
  });
});
