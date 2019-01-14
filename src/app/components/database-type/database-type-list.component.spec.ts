import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {cold, getTestScheduler} from 'jasmine-marbles';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {DatabaseTypeListComponent, ModalComponent} from '..';
import {DatabaseType, WinResponse} from '../../model';
import {TestDomain} from '../../model/test-domain';
import {DatabaseTypeService, ModalService} from '../../services';
import {DatabaseTypeComponent} from './database-type.component';

class MockDatabaseTypeService extends DatabaseTypeService {
  private response: WinResponse<DatabaseType[]> = {meta: null, data: [TestDomain.APPLICATION_TYPE]};

  public findAll(): Observable<WinResponse<DatabaseType[]>> {
    return cold('--x|', {x: this.response});
  }
}

describe('DatabaseTypeListComponent', () => {
  let component: DatabaseTypeListComponent;
  let fixture: ComponentFixture<DatabaseTypeListComponent>;
  let child: DatabaseTypeComponent;
  let databaseTypeService: DatabaseTypeService;
  let modalService: ModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, HttpClientTestingModule, TableModule],
      declarations: [DatabaseTypeListComponent, DatabaseTypeComponent, ModalComponent],
      providers: [{provide: DatabaseTypeService, useClass: MockDatabaseTypeService}, ModalService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseTypeListComponent);
    component = fixture.componentInstance;
    child = component.databaseTypeComponent;
    fixture.detectChanges();
    databaseTypeService = TestBed.get(DatabaseTypeService);
    modalService = TestBed.get(ModalService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch databaseType list on init', () => {
    getTestScheduler().flush();

    expect(component.databaseTypes.length).toEqual(1);
    expect(component.databaseTypes).toContain(TestDomain.APPLICATION_TYPE);
  });

  it('should reset databaseType component when creating a new databaseType', () => {
    component.resetDatabaseTypeComponent();

    expect(child.passedDatabaseType).toBe(null);
    expect(child.model.id).toBe(null);
  });

  it('should set passed databaseType in databaseType component', () => {
    const databaseType = TestDomain.APPLICATION_TYPE;
    component.setPassedDatabaseType(databaseType);

    expect(child.passedDatabaseType.id).toEqual(databaseType.id);
    expect(child.model.id).toEqual(databaseType.id);
  });

  it('should open modal', () => {
    spyOn(modalService, 'open').and.callThrough();

    component.openModal();

    expect(modalService.open).toHaveBeenCalled();
  });

  it('should refresh databaseTypes on create event', () => {
    spyOn(component, 'refreshDatabaseTypes').and.callThrough();
    component.handleCreate(TestDomain.APPLICATION_TYPE);

    expect(component.refreshDatabaseTypes).toHaveBeenCalled();
  });

  it('should refresh databaseTypes on delete event', () => {
    spyOn(component, 'refreshDatabaseTypes').and.callThrough();
    component.handleDelete(TestDomain.APPLICATION_TYPE);

    expect(component.refreshDatabaseTypes).toHaveBeenCalled();
  });

  it('should refresh databaseTypes on update event', () => {
    spyOn(component, 'refreshDatabaseTypes').and.callThrough();
    component.handleUpdate(TestDomain.APPLICATION_TYPE);

    expect(component.refreshDatabaseTypes).toHaveBeenCalled();
  });
});
