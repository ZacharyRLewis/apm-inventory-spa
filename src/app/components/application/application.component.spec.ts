import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ModalService, ShareDataService} from '@win-angular/services';
import {cold} from 'jasmine-marbles';
import {PanelModule} from 'primeng/panel';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {ApplicationComponent} from '..';
import {Application, Dependency, Deployment, HostServer, TestDomain, WinResponse} from '../../model';
import {ApplicationService, DependencyService, DeploymentService, HostServerService} from '../../services';

class MockApplicationService extends ApplicationService {
  private response: WinResponse<Application> = {meta: null, data: TestDomain.APPLICATION};

  public create(appl: Application): Observable<WinResponse<Application>> {
    return cold('--x|', {x: this.response});
  }

  public update(appl: Application): Observable<WinResponse<Application>> {
    return cold('--x|', {x: this.response});
  }

  public delete(appl: Application): Observable<WinResponse<Application>> {
    return cold('--x|', {x: this.response});
  }
}

class MockDependencyService extends DependencyService {
  private response: WinResponse<Dependency[]> = {meta: null, data: [TestDomain.DEPENDENCY]};

  public refreshDependencies(applicationId: string): Observable<WinResponse<Dependency[]>> {
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

describe('ApplicationComponent', () => {
  let component: ApplicationComponent;
  let fixture: ComponentFixture<ApplicationComponent>;
  let applicationService: ApplicationService;
  let dependencyService: DependencyService;
  let modalService: ModalService;
  let shareDataService: ShareDataService;
  let application: Application;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, FormsModule, HttpClientModule, PanelModule, TableModule],
      declarations: [ApplicationComponent],
      providers: [
        {provide: ApplicationService, useClass: MockApplicationService},
        DependencyService, DeploymentService, HostServerService,
        {provide: ModalService, useClass: MockModalService},
        {provide: ShareDataService, useClass: MockShareDataService},
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    applicationService = TestBed.get(ApplicationService);
    dependencyService = TestBed.get(DependencyService);
    modalService = TestBed.get(ModalService);
    shareDataService = TestBed.get(ShareDataService);
    component.modalId = 'test';
    application = TestDomain.APPLICATION;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form values', () => {
    component.setDefaultValues();

    expect(component.model.id).toEqual(null);
    expect(component.model.name).toEqual('');
    expect(component.model.mnemonic).toEqual('');
    expect(component.model.description).toEqual('');
    expect(component.model.repository).toEqual('');
    expect(component.model.defaultBranch).toEqual('');
    expect(component.model.applicationTypeId).toEqual('');
    expect(component.model.deployments).toEqual([]);
    expect(component.model.dependencies).toEqual([]);
    expect(component.deployments).toEqual([]);
    expect(component.dependencies).toEqual([]);
  });

  it('should close modal', () => {
    spyOn(modalService, 'closeModal').and.callThrough();

    component.closeModal();

    expect(modalService.closeModal).toHaveBeenCalled();
  });

  it('should call update application when passedApplication exists', () => {
    spyOn(component, 'createApplication').and.callThrough();
    spyOn(component, 'updateApplication').and.callThrough();

    component.passedApplication = Object.assign({}, application);
    component.saveApplication();

    expect(component.updateApplication).toHaveBeenCalledTimes(1);
    expect(component.createApplication).toHaveBeenCalledTimes(0);
  });

  it('should call create application when passedApplication doesnt exist', () => {
    spyOn(component, 'createApplication').and.callThrough();
    spyOn(component, 'updateApplication').and.callThrough();

    component.passedApplication = null;
    component.saveApplication();

    expect(component.updateApplication).toHaveBeenCalledTimes(0);
    expect(component.createApplication).toHaveBeenCalledTimes(1);
  });

  it('should create application', () => {
    spyOn(applicationService, 'create').and.callThrough();

    component.model = Object.assign({}, application);
    component.createApplication();

    expect(applicationService.create).toHaveBeenCalled();

    component.createEvent.subscribe(created => {
      expect(created.id).toEqual('123');
      expect(created.mnemonic).toEqual('test');
    });
  });

  it('should delete application', () => {
    spyOn(applicationService, 'delete').and.callThrough();

    const appl: Application = Object.assign({}, application);
    component.model = appl;
    component.deleteApplication();

    expect(applicationService.delete).toHaveBeenCalledWith(appl);

    component.deleteEvent.subscribe(deleted => {
      expect(deleted.id).toEqual(application.id);
      expect(deleted.mnemonic).toEqual(application.mnemonic);
    });
  });

  it('should update application', () => {
    spyOn(applicationService, 'update').and.callThrough();

    const appl: Application = Object.assign({}, application);
    appl.deployments = [new Deployment('0'), new Deployment('0')];
    component.model = appl;
    component.updateApplication();

    expect(applicationService.update).toHaveBeenCalledWith(appl);

    component.updateEvent.subscribe(updated => {
      expect(updated.id).toEqual(application.id);
      expect(updated.mnemonic).toEqual(application.mnemonic);
    });
  });

  it('should refresh dependencies', () => {
    spyOn(dependencyService, 'refreshDependencies').and.callThrough();
    spyOn(shareDataService, 'blockUI').and.callThrough();

    component.passedApplication = Object.assign({}, application);
    component.refreshDependencies();

    expect(dependencyService.refreshDependencies).toHaveBeenCalled();
    expect(shareDataService.blockUI).toHaveBeenCalled();
  });

  it('should emit add deployment event', () => {
    component.model = application;
    component.addDeployments();

    component.addDeploymentEvent.subscribe(appl => {
      expect(appl.id).toEqual('123');
    });
  });
});
