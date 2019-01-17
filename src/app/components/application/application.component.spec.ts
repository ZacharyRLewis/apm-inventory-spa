import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ModalService} from '@win-angular/services';
import {cold} from 'jasmine-marbles';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {Application, WinResponse} from '../../model';
import {TestDomain} from '../../model/test-domain';
import {ApplicationService, DeploymentService} from '../../services';
import {ApplicationComponent} from './application.component';

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

class MockModalService extends ModalService {
  openModal(modalId: string, hideFocus?: boolean) {
    console.log('open modal');
  }

  closeModal(modalId: string) {
    console.log('close modal');
  }
}

describe('ApplicationComponent', () => {
  let component: ApplicationComponent;
  let fixture: ComponentFixture<ApplicationComponent>;
  let applicationService: ApplicationService;
  let modalService: ModalService;
  let application: Application;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, TableModule],
      declarations: [ApplicationComponent],
      providers: [
        {provide: ApplicationService, useClass: MockApplicationService},
        DeploymentService,
        {provide: ModalService, useClass: MockModalService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    applicationService = TestBed.get(ApplicationService);
    modalService = TestBed.get(ModalService);
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
    expect(component.model.applicationType.name).toEqual('');
    expect(component.model.deployments).toEqual([]);
    expect(component.model.dependencies).toEqual([]);
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

    component.model = Object.assign({}, application);
    component.deleteApplication();

    expect(applicationService.delete).toHaveBeenCalled();

    component.deleteEvent.subscribe(deleted => {
      expect(deleted.id).toEqual(application.id);
      expect(deleted.mnemonic).toEqual(application.mnemonic);
    });
  });

  it('should update application', () => {
    spyOn(applicationService, 'update').and.callThrough();

    component.model = Object.assign({}, application);
    component.updateApplication();

    expect(applicationService.update).toHaveBeenCalled();

    component.updateEvent.subscribe(updated => {
      expect(updated.id).toEqual(application.id);
      expect(updated.mnemonic).toEqual(application.mnemonic);
    });
  });
});
