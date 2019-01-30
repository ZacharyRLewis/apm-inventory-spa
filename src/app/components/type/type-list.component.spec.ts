import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ModalService} from '@win-angular/services';
import {cold, getTestScheduler} from 'jasmine-marbles';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {ApplicationTypeComponent, DatabaseTypeComponent, TypeListComponent} from '..';
import {ApplicationType, DatabaseType, TestDomain, WinResponse} from '../../model';
import {ApplicationTypeService, DatabaseTypeService} from '../../services';

class MockApplicationTypeService extends ApplicationTypeService {
  private response: WinResponse<ApplicationType[]> = {meta: null, data: [TestDomain.APPLICATION_TYPE]};

  public findAll(): Observable<WinResponse<ApplicationType[]>> {
    return cold('--x|', {x: this.response});
  }
}

class MockDatabaseTypeService extends DatabaseTypeService {
  private response: WinResponse<DatabaseType[]> = {meta: null, data: [TestDomain.DATABASE_TYPE]};

  public findAll(): Observable<WinResponse<DatabaseType[]>> {
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

describe('TypeListComponent', () => {
  let component: TypeListComponent;
  let fixture: ComponentFixture<TypeListComponent>;
  let child: ApplicationTypeComponent;
  let child2: DatabaseTypeComponent;
  let applicationTypeService: ApplicationTypeService;
  let modalService: ModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, HttpClientTestingModule, TableModule],
      declarations: [TypeListComponent, ApplicationTypeComponent, DatabaseTypeComponent],
      providers: [
        {provide: ApplicationTypeService, useClass: MockApplicationTypeService},
        {provide: DatabaseTypeService, useClass: MockDatabaseTypeService},
        {provide: ModalService, useClass: MockModalService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeListComponent);
    component = fixture.componentInstance;
    child = component.applicationTypeComponent;
    child2 = component.databaseTypeComponent;
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

  it('should fetch databaseType list on init', () => {
    getTestScheduler().flush();

    expect(component.databaseTypes.length).toEqual(1);
    expect(component.databaseTypes).toContain(TestDomain.DATABASE_TYPE);
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

  it('should reset databaseType component when creating a new databaseType', () => {
    component.resetDatabaseTypeComponent();

    expect(child2.passedDatabaseType).toBe(null);
    expect(child2.model.id).toBe(null);
  });

  it('should set passed databaseType in databaseType component', () => {
    const databaseType = TestDomain.DATABASE_TYPE;
    component.setPassedDatabaseType(databaseType);

    expect(child2.passedDatabaseType.id).toEqual(databaseType.id);
    expect(child2.model.id).toEqual(databaseType.id);
  });

  it('should open application type modal', () => {
    spyOn(modalService, 'openModal').and.callThrough();

    component.openModal('application-type-modal');

    expect(modalService.openModal).toHaveBeenCalled();
  });

  it('should open database type modal', () => {
    spyOn(modalService, 'openModal').and.callThrough();

    component.openModal('database-type-modal');

    expect(modalService.openModal).toHaveBeenCalled();
  });

  it('should refresh applicationTypes on create event', () => {
    spyOn(component, 'refreshApplicationTypes').and.callThrough();
    component.handleApplicationTypeCreate(TestDomain.APPLICATION_TYPE);

    expect(component.refreshApplicationTypes).toHaveBeenCalled();
  });

  it('should refresh applicationTypes on delete event', () => {
    spyOn(component, 'refreshApplicationTypes').and.callThrough();
    component.handleApplicationTypeDelete(TestDomain.APPLICATION_TYPE);

    expect(component.refreshApplicationTypes).toHaveBeenCalled();
  });

  it('should refresh applicationTypes on update event', () => {
    spyOn(component, 'refreshApplicationTypes').and.callThrough();
    component.handleApplicationTypeUpdate(TestDomain.APPLICATION_TYPE);

    expect(component.refreshApplicationTypes).toHaveBeenCalled();
  });

  it('should refresh databaseTypes on create event', () => {
    spyOn(component, 'refreshDatabaseTypes').and.callThrough();
    component.handleDatabaseTypeCreate(TestDomain.DATABASE_TYPE);

    expect(component.refreshDatabaseTypes).toHaveBeenCalled();
  });

  it('should refresh databaseTypes on delete event', () => {
    spyOn(component, 'refreshDatabaseTypes').and.callThrough();
    component.handleDatabaseTypeDelete(TestDomain.DATABASE_TYPE);

    expect(component.refreshDatabaseTypes).toHaveBeenCalled();
  });

  it('should refresh databaseTypes on update event', () => {
    spyOn(component, 'refreshDatabaseTypes').and.callThrough();
    component.handleDatabaseTypeUpdate(TestDomain.DATABASE_TYPE);

    expect(component.refreshDatabaseTypes).toHaveBeenCalled();
  });
});
