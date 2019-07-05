import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ModalService} from '@win-angular/services';
import {cold} from 'jasmine-marbles';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {DeploymentBulkAddComponent} from '..';
import {Deployment, HostServer, TestDomain, WinResponse} from '../../model';
import {DatabaseService, DeploymentService} from '../../services';

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

class MockModalService extends ModalService {
  openModal(modalId: string, hideFocus?: boolean) {
    console.log('open modal');
  }

  closeModal(modalId: string) {
    console.log('close modal');
  }
}

describe('DeploymentBulkAddComponent', () => {
  let component: DeploymentBulkAddComponent;
  let fixture: ComponentFixture<DeploymentBulkAddComponent>;
  let deploymentService: DeploymentService;
  let databaseService: DatabaseService;
  let modalService: ModalService;
  let deployment: Deployment;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, TableModule],
      declarations: [DeploymentBulkAddComponent],
      providers: [
        {provide: DeploymentService, useClass: MockDeploymentService},
        DatabaseService,
        {provide: ModalService, useClass: MockModalService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentBulkAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deploymentService = TestBed.get(DeploymentService);
    databaseService = TestBed.get(DatabaseService);
    modalService = TestBed.get(ModalService);
    component.modalId = 'test';
    deployment = TestDomain.DEPLOYMENT;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form values', () => {
    component.setDefaultValues();

    expect(component.passedApplication.id).toEqual('');
    expect(component.environment).toEqual('');
    expect(component.directory).toEqual('');
    expect(component.https).toEqual(false);
    expect(component.hostServerId).toEqual('');
    expect(component.port).toEqual('');
    expect(component.contextName).toEqual('');
  });

  it('should dismiss modal', () => {
    spyOn(modalService, 'closeModal').and.callThrough();

    component.closeModal();

    component.cancelAppDeploymentEvent.subscribe(application => {
      expect(application.id).toEqual('123');
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

  it('should emit cancel bulk deployment event', () => {
    component.passedApplication = TestDomain.APPLICATION;
    component.backToApplication();

    component.cancelAppDeploymentEvent.subscribe(application => {
      expect(application.id).toEqual('123');
    });
  });

  it('should emit create bulk deployment event', () => {
    component.deployments = [deployment];
    component.passedApplication = TestDomain.APPLICATION;
    component.addToApplication();

    component.createAppDeploymentEvent.subscribe(({application, deployment1}) => {
      expect(application.id).toEqual('123');
      expect(deployment1.id).toEqual('123');
    });
  });

  it('should create deployment from fields', () => {
    component.deployments = [];
    component.passedApplication = TestDomain.APPLICATION;
    component.environment = 'DEV';
    component.directory = '/test';
    component.https = true;
    component.hostServerId = '1';
    component.port = '1234';
    component.contextName = 'test-service';
    component.createDeploymentFromFields();

    expect(component.deployments.length).toEqual(1);

    const created = component.deployments[0];
    expect(component.passedApplication.id).toEqual(created.applicationId);
    expect(component.environment).toEqual(created.environment);
    expect(component.directory).toEqual(created.directory);
    expect(component.https).toEqual(created.https);
    expect(component.hostServerId).toEqual(created.hostServerId);
    expect(component.port).toEqual(created.port);
    expect(component.contextName).toEqual(created.contextName);
  });

  it('should not create deployment from fields if they are empty', () => {
    component.deployments = [];
    component.setDefaultValues();
    component.createDeploymentFromFields();

    expect(component.deployments.length).toEqual(0);
  });
});
