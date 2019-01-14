import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {cold, getTestScheduler} from 'jasmine-marbles';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {ApplicationTypeListComponent, ModalComponent} from '..';
import {ApplicationType, WinResponse} from '../../model';
import {TestDomain} from '../../model/test-domain';
import {ApplicationTypeService, ModalService} from '../../services';
import {ApplicationTypeComponent} from './application-type.component';

class MockApplicationTypeService extends ApplicationTypeService {
  private response: WinResponse<ApplicationType[]> = {meta: null, data: [TestDomain.APPLICATION_TYPE]};

  public findAll(): Observable<WinResponse<ApplicationType[]>> {
    return cold('--x|', {x: this.response});
  }
}

describe('ApplicationTypeListComponent', () => {
  let component: ApplicationTypeListComponent;
  let fixture: ComponentFixture<ApplicationTypeListComponent>;
  let child: ApplicationTypeComponent;
  let applicationTypeService: ApplicationTypeService;
  let modalService: ModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, HttpClientTestingModule, TableModule],
      declarations: [ApplicationTypeListComponent, ApplicationTypeComponent, ModalComponent],
      providers: [{provide: ApplicationTypeService, useClass: MockApplicationTypeService}, ModalService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationTypeListComponent);
    component = fixture.componentInstance;
    child = component.applicationTypeComponent;
    fixture.detectChanges();
    applicationTypeService = TestBed.get(ApplicationTypeService);
    modalService = TestBed.get(ModalService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch applicationType list on init', () => {
    getTestScheduler().flush();

    expect(component.applicationTypes.length).toEqual(1);
    expect(component.applicationTypes).toContain(TestDomain.APPLICATION_TYPE);
  });

  it('should reset applicationType component when creating a new applicationType', () => {
    component.resetApplicationTypeComponent();

    expect(child.passedApplicationType).toBe(null);
    expect(child.model.id).toBe(null);
  });

  it('should set passed applicationType in applicationType component', () => {
    const applicationType = TestDomain.APPLICATION_TYPE;
    component.setPassedApplicationType(applicationType);

    expect(child.passedApplicationType.id).toEqual(applicationType.id);
    expect(child.model.id).toEqual(applicationType.id);
  });

  it('should open modal', () => {
    spyOn(modalService, 'open').and.callThrough();

    component.openModal();

    expect(modalService.open).toHaveBeenCalled();
  });

  it('should refresh applicationTypes on create event', () => {
    spyOn(component, 'refreshApplicationTypes').and.callThrough();
    component.handleCreate(TestDomain.APPLICATION_TYPE);

    expect(component.refreshApplicationTypes).toHaveBeenCalled();
  });

  it('should refresh applicationTypes on delete event', () => {
    spyOn(component, 'refreshApplicationTypes').and.callThrough();
    component.handleDelete(TestDomain.APPLICATION_TYPE);

    expect(component.refreshApplicationTypes).toHaveBeenCalled();
  });

  it('should refresh applicationTypes on update event', () => {
    spyOn(component, 'refreshApplicationTypes').and.callThrough();
    component.handleUpdate(TestDomain.APPLICATION_TYPE);

    expect(component.refreshApplicationTypes).toHaveBeenCalled();
  });
});
