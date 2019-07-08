import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {DeploymentBulkAddComponent} from '..';
import {Deployment, HostServer, TestDomain} from '../../model';

describe('DeploymentBulkAddComponent', () => {
  let component: DeploymentBulkAddComponent;
  let fixture: ComponentFixture<DeploymentBulkAddComponent>;
  let deployment: Deployment;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, TableModule],
      declarations: [DeploymentBulkAddComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentBulkAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.modalId = 'test';
    deployment = TestDomain.DEPLOYMENT;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form values', () => {
    component.setDefaultValues();

    expect(component.passedApplication.id).toEqual('');
    expect(component.model.environment).toEqual('');
    expect(component.model.directory).toEqual('');
    expect(component.model.https).toEqual(false);
    expect(component.model.hostServerId).toEqual('');
    expect(component.model.port).toEqual('');
    expect(component.model.contextName).toEqual('');
  });

  it('should dismiss modal', () => {
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
    component.model.environment = 'DEV';
    component.model.directory = '/test';
    component.model.https = true;
    component.model.hostServerId = '1';
    component.model.port = '1234';
    component.model.contextName = 'test-service';
    component.createDeploymentFromFields();

    expect(component.deployments.length).toEqual(1);

    const created = component.deployments[0];
    expect(component.passedApplication.id).toEqual(created.applicationId);
    expect(component.model.environment).toEqual(created.environment);
    expect(component.model.directory).toEqual(created.directory);
    expect(component.model.https).toEqual(created.https);
    expect(component.model.hostServerId).toEqual(created.hostServerId);
    expect(component.model.port).toEqual(created.port);
    expect(component.model.contextName).toEqual(created.contextName);
  });

  it('should not create deployment from fields if they are empty', () => {
    component.deployments = [];
    component.setDefaultValues();
    component.createDeploymentFromFields();

    expect(component.deployments.length).toEqual(0);
  });
});
