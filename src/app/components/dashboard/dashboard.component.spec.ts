import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ShareDataService} from '@win-angular/services';
import {cold, getTestScheduler} from 'jasmine-marbles';
import {AutoCompleteModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {Database, Dependency, Deployment, DeploymentDatabase, HostServer, TestDomain, WinResponse} from '../../model';
import {
  ApplicationDependencyService,
  DatabaseService,
  DependencyService,
  DeploymentDatabaseService,
  DeploymentService,
  HostServerService
} from '../../services';

import {DashboardComponent} from './dashboard.component';

class MockShareDataService extends ShareDataService {
  blockUI(isBlockUI: boolean) {
    console.log('block ui = ' + isBlockUI);
  }
}

class MockDependencyService extends DependencyService {
  private response: WinResponse<Dependency[]> = {meta: null, data: [TestDomain.DEPENDENCY]};

  public findAll(): Observable<WinResponse<Dependency[]>> {
    return cold('--x|', {x: this.response});
  }
}

class MockDeploymentService extends DeploymentService {
  private response: WinResponse<Deployment[]> = {meta: null, data: [TestDomain.DEPLOYMENT]};

  public findAll(): Observable<WinResponse<Deployment[]>> {
    return cold('--x|', {x: this.response});
  }
}

class MockDeploymentDatabaseService extends DeploymentDatabaseService {
  private response: WinResponse<DeploymentDatabase[]> = {meta: null, data: [TestDomain.DEPLOYMENT_DATABASE]};

  public findAll(): Observable<WinResponse<DeploymentDatabase[]>> {
    return cold('--x|', {x: this.response});
  }
}

class MockHostServerService extends HostServerService {
  private response: WinResponse<HostServer[]> = {meta: null, data: [TestDomain.HOST_SERVER]};

  public findAll(): Observable<WinResponse<HostServer[]>> {
    return cold('--x|', {x: this.response});
  }
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let applicationDependencyService: ApplicationDependencyService;
  let dependencyService: DependencyService;
  let deploymentDatabaseService: DeploymentDatabaseService;
  let deploymentService: DeploymentService;
  let hostServerService: HostServerService;
  let shareDataService: ShareDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AutoCompleteModule, FormsModule, HttpClientModule, HttpClientTestingModule, TableModule],
      declarations: [DashboardComponent],
      providers: [
        ApplicationDependencyService,
        {provide: DeploymentDatabaseService, useClass: MockDeploymentDatabaseService},
        {provide: DependencyService, useClass: MockDependencyService},
        {provide: DeploymentService, useClass: MockDeploymentService},
        {provide: HostServerService, useClass: MockHostServerService},
        {provide: ShareDataService, useClass: MockShareDataService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    applicationDependencyService = TestBed.get(ApplicationDependencyService);
    dependencyService = TestBed.get(DependencyService);
    deploymentDatabaseService = TestBed.get(DeploymentDatabaseService);
    deploymentService = TestBed.get(DeploymentService);
    hostServerService = TestBed.get(HostServerService);
    shareDataService = TestBed.get(ShareDataService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch dependencies on init', () => {
    getTestScheduler().flush();

    expect(component.dependencies.length).toEqual(1);
    expect(component.dependencies).toContain(TestDomain.DEPENDENCY);
  });

  it('should fetch deployments on init', () => {
    getTestScheduler().flush();

    expect(component.deployments.length).toEqual(1);
    expect(component.deployments).toContain(TestDomain.DEPLOYMENT);
  });

  it('should fetch database users on init', () => {
    getTestScheduler().flush();

    expect(component.databaseUsers.length).toEqual(1);
    expect(component.databaseUsers).toContain(TestDomain.DEPLOYMENT_DATABASE.connectionUsername);
  });

  it('should fetch host servers on init', () => {
    getTestScheduler().flush();

    expect(component.hostServers.length).toEqual(1);
    expect(component.hostServers).toContain(TestDomain.HOST_SERVER);
  });

  it('should load ports in use', () => {
    component.portsInUse = [];
    component.deployments = [TestDomain.DEPLOYMENT];

    component.loadPortsInUse();

    expect(component.portsInUse.length).toEqual(1);
  });

  it('should toggle tabs correctly', () => {
    component.applicationDependencies = [TestDomain.APPLICATION_DEPENDENCY];
    component.deploymentDatabases = [TestDomain.DEPLOYMENT_DATABASE];
    component.portDeployments = [TestDomain.DEPLOYMENT];

    component.toggleTabs(999);

    expect(component.applicationDependencies.length).toEqual(0);
    expect(component.deploymentDatabases.length).toEqual(0);
    expect(component.portDeployments.length).toEqual(0);
    expect(component.selectedTab).toEqual(999);
  });

  it('should not filter application dependencies if no manager reference exists', () => {
    spyOn(shareDataService, 'blockUI').and.callThrough();
    spyOn(applicationDependencyService, 'filterAll').and.callThrough();

    component.selectedDependencyReference = null;
    component.findApplicationDependenciesByReference();

    expect(shareDataService.blockUI).toHaveBeenCalledTimes(0);
    expect(applicationDependencyService.filterAll).toHaveBeenCalledTimes(0);
  });

  it('should filter application dependencies by manager reference', () => {
    spyOn(shareDataService, 'blockUI').and.callThrough();
    spyOn(applicationDependencyService, 'filterAll').and.callThrough();

    component.selectedDependencyReference = 'test';
    component.findApplicationDependenciesByReference();

    const params = [{name: 'reference', value: 'test'}];

    expect(shareDataService.blockUI).toHaveBeenCalledTimes(1);
    expect(applicationDependencyService.filterAll).toHaveBeenCalledWith(params);
  });

  it('should not filter deployment databases if no connection username exists', () => {
    spyOn(shareDataService, 'blockUI').and.callThrough();
    spyOn(deploymentDatabaseService, 'filterAll').and.callThrough();

    component.selectedDatabaseUser = null;
    component.findDeploymentDatabasesByDatabaseUser();

    expect(shareDataService.blockUI).toHaveBeenCalledTimes(0);
    expect(deploymentDatabaseService.filterAll).toHaveBeenCalledTimes(0);
  });

  it('should filter deployment databases by connection username', () => {
    spyOn(shareDataService, 'blockUI').and.callThrough();
    spyOn(deploymentDatabaseService, 'filterAll').and.callThrough();

    component.selectedDatabaseUser = 'test';
    component.findDeploymentDatabasesByDatabaseUser();

    const params = [{name: 'connectionUsername', value: 'test'}];

    expect(shareDataService.blockUI).toHaveBeenCalledTimes(1);
    expect(deploymentDatabaseService.filterAll).toHaveBeenCalledWith(params);
  });

  it('should not filter deployments if no port exists', () => {
    spyOn(shareDataService, 'blockUI').and.callThrough();
    spyOn(deploymentService, 'filterAll').and.callThrough();

    component.selectedPort = null;
    component.findDeploymentsByPort();

    expect(shareDataService.blockUI).toHaveBeenCalledTimes(0);
    expect(deploymentService.filterAll).toHaveBeenCalledTimes(0);
  });

  it('should filter deployments by port', () => {
    spyOn(shareDataService, 'blockUI').and.callThrough();
    spyOn(deploymentService, 'filterAll').and.callThrough();

    component.selectedPort = '1234';
    component.findDeploymentsByPort();

    const params = [{name: 'port', value: '1234'}];

    expect(shareDataService.blockUI).toHaveBeenCalledTimes(1);
    expect(deploymentService.filterAll).toHaveBeenCalledWith(params);
  });

  it('should select a dependency suggestion', () => {
    spyOn(component, 'performDependencySearch').and.callThrough();

    const dependency = TestDomain.DEPENDENCY;
    component.selectDependencySuggestion(dependency);

    expect(component.performDependencySearch).toHaveBeenCalledTimes(1);
  });

  it('should select a database user suggestion', () => {
    spyOn(component, 'performDatabaseUserSearch').and.callThrough();

    component.selectDatabaseUserSuggestion('test');

    expect(component.performDatabaseUserSearch).toHaveBeenCalledTimes(1);
  });

  it('should select a port suggestion', () => {
    spyOn(component, 'performPortSearch').and.callThrough();

    component.selectPortSuggestion('1234');

    expect(component.performPortSearch).toHaveBeenCalledTimes(1);
  });

  it('should perform dependency search', () => {
    spyOn(component, 'findApplicationDependenciesByReference').and.callThrough();

    component.selectedDependencyReference = 'test';
    component.performDependencySearch();

    expect(component.findApplicationDependenciesByReference).toHaveBeenCalledTimes(1);
    expect(component.selectedDependencyReference).toEqual('');
    expect(component.dependencySuggestions.length).toEqual(0);
  });

  it('should perform database user search', () => {
    spyOn(component, 'findDeploymentDatabasesByDatabaseUser').and.callThrough();

    component.selectedDatabaseUser = 'test';
    component.performDatabaseUserSearch();

    expect(component.findDeploymentDatabasesByDatabaseUser).toHaveBeenCalledTimes(1);
    expect(component.selectedDatabaseUser).toEqual('');
    expect(component.databaseUserSuggestions.length).toEqual(0);
  });

  it('should perform port search', () => {
    spyOn(component, 'findDeploymentsByPort').and.callThrough();

    component.selectedPort = '1234';
    component.performPortSearch();

    expect(component.findDeploymentsByPort).toHaveBeenCalledTimes(1);
    expect(component.selectedPort).toEqual('');
    expect(component.portSuggestions.length).toEqual(0);
  });

  it('should process dependency typeaheads correctly', () => {
    component.selectedDependencyReference = 'test';
    component.dependencies = [TestDomain.DEPENDENCY];

    component.processDependencyTypeAhead();

    expect(component.dependencySuggestions.length).toEqual(1);

    component.selectedDependencyReference = 'typeahead';
    component.dependencies = [TestDomain.DEPENDENCY];

    component.processDependencyTypeAhead();

    expect(component.dependencySuggestions.length).toEqual(0);

    component.selectedDependencyReference = '';

    component.processDependencyTypeAhead();

    expect(component.dependencySuggestions.length).toEqual(0);
  });

  it('should process database user typeaheads correctly', () => {
    component.selectedDatabaseUser = 'test';
    component.databaseUsers = ['test'];

    component.processDatabaseUserTypeAhead();

    expect(component.databaseUserSuggestions.length).toEqual(1);

    component.selectedDatabaseUser = 'typeahead';
    component.databaseUsers = ['test'];

    component.processDatabaseUserTypeAhead();

    expect(component.databaseUserSuggestions.length).toEqual(0);

    component.selectedDatabaseUser = '';

    component.processDatabaseUserTypeAhead();

    expect(component.databaseUserSuggestions.length).toEqual(0);
  });

  it('should process port typeaheads correctly', () => {
    component.selectedPort = '1234';
    component.portsInUse = ['1234'];

    component.processPortTypeAhead();

    expect(component.portSuggestions.length).toEqual(1);

    component.selectedPort = 'typeahead';
    component.portsInUse = ['1234'];

    component.processPortTypeAhead();

    expect(component.portSuggestions.length).toEqual(0);

    component.selectedPort = '';

    component.processPortTypeAhead();

    expect(component.portSuggestions.length).toEqual(0);
  });
});
