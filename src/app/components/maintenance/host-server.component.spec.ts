import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ModalService, ShareDataService} from '@win-angular/services';
import {cold} from 'jasmine-marbles';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {HostServerComponent} from '..';
import {HostServer, TestDomain, WinResponse} from '../../model';
import {HostServerService} from '../../services';

class MockHostServerService extends HostServerService {
  private response: WinResponse<HostServer> = {meta: null, data: TestDomain.HOST_SERVER};

  public create(hostServer: HostServer): Observable<WinResponse<HostServer>> {
    return cold('--x|', {x: this.response});
  }

  public update(hostServer: HostServer): Observable<WinResponse<HostServer>> {
    return cold('--x|', {x: this.response});
  }

  public delete(hostServer: HostServer): Observable<WinResponse<HostServer>> {
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

describe('HostServerComponent', () => {
  let component: HostServerComponent;
  let fixture: ComponentFixture<HostServerComponent>;
  let hostServerService: HostServerService;
  let modalService: ModalService;
  let hostServer: HostServer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, TableModule],
      declarations: [HostServerComponent],
      providers: [
        {provide: HostServerService, useClass: MockHostServerService},
        {provide: ModalService, useClass: MockModalService},
        ShareDataService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    hostServerService = TestBed.get(HostServerService);
    modalService = TestBed.get(ModalService);
    component.modalId = 'test';
    hostServer = TestDomain.HOST_SERVER;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form values', () => {
    component.setDefaultValues();

    expect(component.model.id).toEqual(null);
    expect(component.model.name).toEqual('');
    expect(component.model.operatingSystem).toEqual('');
    expect(component.model.environment).toEqual('');
  });

  it('should close modal', () => {
    spyOn(modalService, 'closeModal').and.callThrough();

    component.closeModal();

    expect(modalService.closeModal).toHaveBeenCalled();
  });

  it('should call update hostServer when passedHostServer exists', () => {
    spyOn(component, 'createHostServer').and.callThrough();
    spyOn(component, 'updateHostServer').and.callThrough();

    component.passedHostServer = Object.assign({}, hostServer);
    component.saveHostServer();

    expect(component.updateHostServer).toHaveBeenCalledTimes(1);
    expect(component.createHostServer).toHaveBeenCalledTimes(0);
  });

  it('should call create hostServer when passedHostServer doesnt exist', () => {
    spyOn(component, 'createHostServer').and.callThrough();
    spyOn(component, 'updateHostServer').and.callThrough();

    component.passedHostServer = null;
    component.saveHostServer();

    expect(component.updateHostServer).toHaveBeenCalledTimes(0);
    expect(component.createHostServer).toHaveBeenCalledTimes(1);
  });

  it('should create hostServer', () => {
    spyOn(hostServerService, 'create').and.callThrough();

    component.model = Object.assign({}, hostServer);
    component.createHostServer();

    expect(hostServerService.create).toHaveBeenCalled();

    component.createEvent.subscribe(created => {
      expect(created.id).toEqual('123');
    });
  });

  it('should delete hostServer', () => {
    spyOn(hostServerService, 'delete').and.callThrough();

    component.model = Object.assign({}, hostServer);
    component.deleteHostServer();

    expect(hostServerService.delete).toHaveBeenCalled();

    component.deleteEvent.subscribe(deleted => {
      expect(deleted.id).toEqual(hostServer.id);
    });
  });

  it('should update hostServer', () => {
    spyOn(hostServerService, 'update').and.callThrough();

    component.model = Object.assign({}, hostServer);
    component.updateHostServer();

    expect(hostServerService.update).toHaveBeenCalled();

    component.updateEvent.subscribe(updated => {
      expect(updated.id).toEqual(hostServer.id);
    });
  });
});
