import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {cold} from 'jasmine-marbles';
import {Observable} from 'rxjs';
import {ApplicationType, WinResponse} from '../../model';
import {TestDomain} from '../../model/test-domain';
import {ApplicationTypeService, ModalService} from '../../services';
import {ApplicationTypeComponent} from './application-type.component';

class MockApplicationTypeService extends ApplicationTypeService {
  private response: WinResponse<ApplicationType> = {meta: null, data: TestDomain.APPLICATION_TYPE};

  public create(applicationType: ApplicationType): Observable<WinResponse<ApplicationType>> {
    return cold('--x|', {x: this.response});
  }

  public update(applicationType: ApplicationType): Observable<WinResponse<ApplicationType>> {
    return cold('--x|', {x: this.response});
  }

  public delete(applicationType: ApplicationType): Observable<WinResponse<ApplicationType>> {
    return cold('--x|', {x: this.response});
  }
}

describe('ApplicationTypeComponent', () => {
  let component: ApplicationTypeComponent;
  let fixture: ComponentFixture<ApplicationTypeComponent>;
  let applicationTypeService: ApplicationTypeService;
  let modalService: ModalService;
  let applicationType: ApplicationType;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule],
      declarations: [ApplicationTypeComponent],
      providers: [{provide: ApplicationTypeService, useClass: MockApplicationTypeService}, ModalService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    applicationTypeService = TestBed.get(ApplicationTypeService);
    modalService = TestBed.get(ModalService);
    modalService.modals = [TestDomain.TEST_MODAL];
    component.modalId = 'test';
    applicationType = TestDomain.APPLICATION_TYPE;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form values', () => {
    component.setDefaultValues();

    expect(component.model.id).toEqual(null);
    expect(component.model.name).toEqual('');
    expect(component.model.version).toEqual('');
  });

  it('should close modal', () => {
    spyOn(modalService, 'close').and.callThrough();

    component.closeModal();

    expect(modalService.close).toHaveBeenCalled();
  });

  it('should call update applicationType when passedApplicationType exists', () => {
    spyOn(component, 'createApplicationType').and.callThrough();
    spyOn(component, 'updateApplicationType').and.callThrough();

    component.passedApplicationType = Object.assign({}, applicationType);
    component.saveApplicationType();

    expect(component.updateApplicationType).toHaveBeenCalledTimes(1);
    expect(component.createApplicationType).toHaveBeenCalledTimes(0);
  });

  it('should call create applicationType when passedApplicationType doesnt exist', () => {
    spyOn(component, 'createApplicationType').and.callThrough();
    spyOn(component, 'updateApplicationType').and.callThrough();

    component.passedApplicationType = null;
    component.saveApplicationType();

    expect(component.updateApplicationType).toHaveBeenCalledTimes(0);
    expect(component.createApplicationType).toHaveBeenCalledTimes(1);
  });

  it('should create applicationType', () => {
    spyOn(applicationTypeService, 'create').and.callThrough();

    component.model = Object.assign({}, applicationType);
    component.createApplicationType();

    expect(applicationTypeService.create).toHaveBeenCalled();

    component.createEvent.subscribe(created => {
      expect(created.id).toEqual('123');
    });
  });

  it('should delete applicationType', () => {
    spyOn(applicationTypeService, 'delete').and.callThrough();

    component.model = Object.assign({}, applicationType);
    component.deleteApplicationType();

    expect(applicationTypeService.delete).toHaveBeenCalled();

    component.deleteEvent.subscribe(deleted => {
      expect(deleted.id).toEqual(applicationType.id);
    });
  });

  it('should update applicationType', () => {
    spyOn(applicationTypeService, 'update').and.callThrough();

    component.model = Object.assign({}, applicationType);
    component.updateApplicationType();

    expect(applicationTypeService.update).toHaveBeenCalled();

    component.updateEvent.subscribe(updated => {
      expect(updated.id).toEqual(applicationType.id);
    });
  });
});
