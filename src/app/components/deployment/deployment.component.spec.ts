import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ModalService} from '@win-angular/services';
import {cold, getTestScheduler} from 'jasmine-marbles';
import {PanelModule} from 'primeng/panel';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {DeploymentComponent} from '..';
import {Database, Deployment, DeploymentDatabase, HostServer, MulesoftApi, TestDomain, WinResponse} from '../../model';
import {DatabaseService, DeploymentDatabaseService, DeploymentService, MulesoftApiService} from '../../services';

class MockDeploymentService extends DeploymentService {
  private response: WinResponse<Deployment> = {meta: null, data: TestDomain.DEPLOYMENT};

  public create(deployment: Deployment): Observable<WinResponse<Deployment>> {
    return cold('--x|', {x: this.response});
  }

  public update(deployment: Deployment): Observable<WinResponse<Deployment>> {
    return cold('--x|', {x: this.response});
  }

  public delete(deployment: Deployment): Observable<WinResponse<Deployment>> {
    return cold('--x|', {x: this.response});
  }
}

class MockDatabaseService extends DatabaseService {
  private response: WinResponse<Database[]> = {meta: null, data: [TestDomain.DATABASE]};

  public findAll(): Observable<WinResponse<Database[]>> {
    return cold('--x|', {x: this.response});
  }
}

class MockDeploymentDatabaseService extends DeploymentDatabaseService {
  private response: WinResponse<DeploymentDatabase[]> = {meta: null, data: [TestDomain.DEPLOYMENT_DATABASE]};

  public findAllByDeploymentId(deploymentId: string): Observable<WinResponse<DeploymentDatabase[]>> {
    return cold('--x|', {x: this.response});
  }
}

class MockMulesoftApiService extends MulesoftApiService {
  private response: WinResponse<MulesoftApi[]> = {meta: null, data: [TestDomain.MULESOFT_API]};

  public findAll(): Observable<WinResponse<MulesoftApi[]>> {
    return cold('--x|', {x: this.response});
  }

  public filterAll(params: {name: any; value: any}[]): Observable<WinResponse<MulesoftApi[]>> {
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

describe('DeploymentComponent', () => {
  let component: DeploymentComponent;
  let fixture: ComponentFixture<DeploymentComponent>;
  let deploymentDatabaseService: DeploymentDatabaseService;
  let deploymentService: DeploymentService;
  let databaseService: DatabaseService;
  let mulesoftApiService: MulesoftApiService;
  let modalService: ModalService;
  let deployment: Deployment;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, FormsModule, HttpClientModule, PanelModule, TableModule],
      declarations: [DeploymentComponent],
      providers: [
        {provide: DatabaseService, useClass: MockDatabaseService},
        {provide: DeploymentService, useClass: MockDeploymentService},
        {provide: DeploymentDatabaseService, useClass: MockDeploymentDatabaseService},
        {provide: MulesoftApiService, useClass: MockMulesoftApiService},
        {provide: ModalService, useClass: MockModalService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deploymentDatabaseService = TestBed.get(DeploymentDatabaseService);
    deploymentService = TestBed.get(DeploymentService);
    databaseService = TestBed.get(DatabaseService);
    mulesoftApiService = TestBed.get(MulesoftApiService);
    modalService = TestBed.get(ModalService);
    component.modalId = 'test';
    deployment = TestDomain.DEPLOYMENT;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form values', () => {
    component.setDefaultValues();

    expect(component.model.id).toEqual(null);
    expect(component.model.applicationId).toEqual(null);
    expect(component.model.environment).toEqual('');
    expect(component.model.directory).toEqual('');
    expect(component.model.https).toEqual(null);
    expect(component.model.hostServerId).toEqual('');
    expect(component.model.port).toEqual('');
    expect(component.model.contextName).toEqual('');
    expect(component.model.databases).toEqual([]);
    expect(component.model.services).toEqual([]);
    expect(component.databases).toEqual([]);
    expect(component.deploymentDatabases).toEqual([]);
  });

  it('should close modal', () => {
    spyOn(modalService, 'closeModal').and.callThrough();

    component.closeModal();

    expect(modalService.closeModal).toHaveBeenCalled();
  });

  it('should fetch databases on init', () => {
    getTestScheduler().flush();

    expect(component.databases.length).toEqual(1);
    expect(component.databases).toContain(TestDomain.DATABASE);
  });

  it('should load deployment databases', () => {
    spyOn(deploymentDatabaseService, 'findAllByDeploymentId').and.callThrough();

    component.passedDeployment = Object.assign({}, deployment);
    component.loadDeploymentDatabases();

    expect(deploymentDatabaseService.findAllByDeploymentId).toHaveBeenCalled();
  });

  it('should load MuleSoft APIs', () => {
    spyOn(mulesoftApiService, 'filterAll').and.callThrough();

    const params = [{name: 'assetId', value: 'test'}];
    component.loadApis('test');

    expect(mulesoftApiService.filterAll).toHaveBeenCalledWith(params);
  });

  it('should call update deployment when passedDeployment exists', () => {
    spyOn(component, 'createDeployment').and.callThrough();
    spyOn(component, 'updateDeployment').and.callThrough();

    component.passedDeployment = Object.assign({}, deployment);
    component.saveDeployment();

    expect(component.updateDeployment).toHaveBeenCalledTimes(1);
    expect(component.createDeployment).toHaveBeenCalledTimes(0);
  });

  it('should call create deployment when passedDeployment doesnt exist', () => {
    spyOn(component, 'createDeployment').and.callThrough();
    spyOn(component, 'updateDeployment').and.callThrough();

    component.passedDeployment = null;
    component.saveDeployment();

    expect(component.updateDeployment).toHaveBeenCalledTimes(0);
    expect(component.createDeployment).toHaveBeenCalledTimes(1);
  });

  it('should create deployment', () => {
    spyOn(deploymentService, 'create').and.callThrough();

    component.model = Object.assign({}, deployment);
    component.createDeployment();

    expect(deploymentService.create).toHaveBeenCalled();

    component.createEvent.subscribe(created => {
      expect(created.id).toEqual('123');
    });
  });

  it('should delete deployment', () => {
    spyOn(deploymentService, 'delete').and.callThrough();

    component.model = Object.assign({}, deployment);
    component.deleteDeployment();

    expect(deploymentService.delete).toHaveBeenCalled();

    component.deleteEvent.subscribe(deleted => {
      expect(deleted.id).toEqual(deployment.id);
    });
  });

  it('should update deployment', () => {
    spyOn(deploymentService, 'update').and.callThrough();

    component.model = Object.assign({}, deployment);
    component.updateDeployment();

    expect(deploymentService.update).toHaveBeenCalled();

    component.updateEvent.subscribe(updated => {
      expect(updated.id).toEqual(deployment.id);
    });
  });

  it('should get host server name correctly', () => {
    component.hostServers = null;
    const hostServerName1: string = component.getHostServerName('123');

    expect(hostServerName1).toEqual('');

    component.hostServers = [TestDomain.HOST_SERVER];
    const hostServerName2: string = component.getHostServerName(null);

    expect(hostServerName2).toEqual('');

    component.hostServers = [TestDomain.HOST_SERVER];
    const hostServerName3: string = component.getHostServerName('999');

    expect(hostServerName3).toBeNull();

    component.hostServers = [TestDomain.HOST_SERVER, new HostServer('456', 'test', 'DEV', 'LINUX')];
    const hostServerName4: string = component.getHostServerName('123');

    expect(hostServerName4).toEqual('localhost');
  });

  it('should format api url correctly', () => {
    component.model = deployment;
    const api: MulesoftApi = TestDomain.MULESOFT_API;
    api.deploymentEnvironment = 'Sandbox';
    const apiUrl1: string = component.formatApiUrl(TestDomain.MULESOFT_API);

    expect(apiUrl1).toEqual('https://devag1.winwholesale.com/' + deployment.contextName);

    api.deploymentEnvironment = 'QA';
    const apiUrl2: string = component.formatApiUrl(TestDomain.MULESOFT_API);

    expect(apiUrl2).toEqual('https://qaag1.winwholesale.com/' + deployment.contextName);

    api.deploymentEnvironment = 'PROD';
    const apiUrl3: string = component.formatApiUrl(TestDomain.MULESOFT_API);

    expect(apiUrl3).toEqual('https://ag1.winwholesale.com/' + deployment.contextName);
  });

  it('should emit add database event', () => {
    component.model = deployment;
    component.addDatabase();

    component.addDatabaseEvent.subscribe(depl => {
      expect(depl.id).toEqual(deployment.id);
    });
  });
});
