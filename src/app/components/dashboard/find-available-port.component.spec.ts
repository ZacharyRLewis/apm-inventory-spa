import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {SelectComponentModule} from '@win-angular/select-component';
import {ModalService, ShareDataService} from '@win-angular/services';
import {cold} from 'jasmine-marbles';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {Deployment, HostServer, TestDomain, WinResponse} from '../../model';
import {DeploymentService} from '../../services';
import {FindAvailablePortComponent} from './find-available-port.component';

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

class MockShareDataService extends ShareDataService {
  blockUI(isBlockUI: boolean) {
    console.log('block ui = ' + isBlockUI);
  }
}

describe('FindAvailablePortComponent', () => {
  let component: FindAvailablePortComponent;
  let fixture: ComponentFixture<FindAvailablePortComponent>;
  let deploymentService: DeploymentService;
  let modalService: ModalService;
  let shareDataService: ShareDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, SelectComponentModule, TableModule],
      declarations: [FindAvailablePortComponent],
      providers: [
        {provide: DeploymentService, useClass: MockDeploymentService},
        {provide: ModalService, useClass: MockModalService},
        {provide: ShareDataService, useClass: MockShareDataService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindAvailablePortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deploymentService = TestBed.get(DeploymentService);
    modalService = TestBed.get(ModalService);
    shareDataService = TestBed.get(ShareDataService);
    component.modalId = 'test';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form values', () => {
    component.setDefaultValues();

    expect(component.hostServerId).toEqual('');
    expect(component.serverNamePattern).toEqual('');
    expect(component.rangeStart).toBeUndefined();
    expect(component.rangeEnd).toBeUndefined();
    expect(component.hostServerIds).toEqual([]);
    expect(component.ports).toEqual([]);
    expect(component.deploymentsInPortRange).toEqual([]);
  });

  it('should close modal', () => {
    spyOn(modalService, 'closeModal').and.callThrough();

    component.closeModal();

    expect(modalService.closeModal).toHaveBeenCalled();
  });

  it('should close modal', () => {
    spyOn(modalService, 'closeModal').and.callThrough();

    component.closeModal();

    expect(modalService.closeModal).toHaveBeenCalled();
  });

  it('should find ports', () => {
    spyOn(shareDataService, 'blockUI').and.callThrough();
    spyOn(deploymentService, 'filterAll').and.callThrough();

    const params = [{name: 'hostServerIds', value: ['123']}];
    component.hostServers = [TestDomain.HOST_SERVER];
    component.serverNamePattern = 'local';

    component.findPorts();

    expect(deploymentService.filterAll).toHaveBeenCalledWith(params);
    expect(shareDataService.blockUI).toHaveBeenCalled();
  });

  it('should correctly make port suggestions', () => {
    const deployment1 = new Deployment('1', '1', 'DEV', '1', '', 'test1', '1002');
    const deployment2 = new Deployment('2', '2', 'DEV', '2', '', 'test2', '1005');
    const deployment3 = new Deployment('3', '3', 'DEV', '3', '', 'test3', '1020');
    const deployments = [deployment1, deployment2, deployment3];

    component.hostServers = [TestDomain.HOST_SERVER];
    component.serverNamePattern = 'local';
    component.rangeStart = 1000;
    component.rangeEnd = 1015;
    component.getPortSuggestions(deployments);

    expect(component.ports.length).toEqual(10);
    expect(component.ports).toEqual([1000, 1001, 1003, 1004, 1006, 1007, 1008, 1009, 1010, 1011]);
    expect(component.deploymentsInPortRange.length).toEqual(2);
    expect(component.deploymentsInPortRange).toEqual([deployment1, deployment2]);
  });

  it('should find host server ids by name pattern', () => {
    component.hostServers = [TestDomain.HOST_SERVER];
    component.serverNamePattern = 'local';
    component.findHostServerIdsByNamePattern();

    expect(component.hostServerIds.length).toEqual(1);
    expect(component.hostServerIds[0]).toEqual('123');
  });

  it('should get deployment base url correctly', () => {
    const deployment = TestDomain.DEPLOYMENT;
    component.hostServers = [TestDomain.HOST_SERVER];

    const url: string = component.getDeploymentBaseUrl(deployment);

    expect(url).toEqual('http://localhost:1234/test-service');
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
});
