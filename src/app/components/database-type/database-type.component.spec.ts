import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {cold} from 'jasmine-marbles';
import {Observable} from 'rxjs';
import {DatabaseType, WinResponse} from '../../model';
import {TestDomain} from '../../model/test-domain';
import {DatabaseTypeService, ModalService} from '../../services';
import {DatabaseTypeComponent} from './database-type.component';

class MockDatabaseTypeService extends DatabaseTypeService {
  private response: WinResponse<DatabaseType> = {meta: null, data: TestDomain.APPLICATION_TYPE};

  public create(databaseType: DatabaseType): Observable<WinResponse<DatabaseType>> {
    return cold('--x|', {x: this.response});
  }

  public update(databaseType: DatabaseType): Observable<WinResponse<DatabaseType>> {
    return cold('--x|', {x: this.response});
  }

  public delete(databaseType: DatabaseType): Observable<WinResponse<DatabaseType>> {
    return cold('--x|', {x: this.response});
  }
}

describe('DatabaseTypeComponent', () => {
  let component: DatabaseTypeComponent;
  let fixture: ComponentFixture<DatabaseTypeComponent>;
  let databaseTypeService: DatabaseTypeService;
  let modalService: ModalService;
  let databaseType: DatabaseType;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule],
      declarations: [DatabaseTypeComponent],
      providers: [{provide: DatabaseTypeService, useClass: MockDatabaseTypeService}, ModalService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    databaseTypeService = TestBed.get(DatabaseTypeService);
    modalService = TestBed.get(ModalService);
    modalService.modals = [TestDomain.TEST_MODAL];
    component.modalId = 'test';
    databaseType = TestDomain.APPLICATION_TYPE;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form values', () => {
    component.setDefaultValues();

    expect(component.model.id).toEqual(null);
    expect(component.model.name).toEqual('');
  });

  it('should close modal', () => {
    spyOn(modalService, 'close').and.callThrough();

    component.closeModal();

    expect(modalService.close).toHaveBeenCalled();
  });

  it('should call update databaseType when passedDatabaseType exists', () => {
    spyOn(component, 'createDatabaseType').and.callThrough();
    spyOn(component, 'updateDatabaseType').and.callThrough();

    component.passedDatabaseType = Object.assign({}, databaseType);
    component.saveDatabaseType();

    expect(component.updateDatabaseType).toHaveBeenCalledTimes(1);
    expect(component.createDatabaseType).toHaveBeenCalledTimes(0);
  });

  it('should call create databaseType when passedDatabaseType doesnt exist', () => {
    spyOn(component, 'createDatabaseType').and.callThrough();
    spyOn(component, 'updateDatabaseType').and.callThrough();

    component.passedDatabaseType = null;
    component.saveDatabaseType();

    expect(component.updateDatabaseType).toHaveBeenCalledTimes(0);
    expect(component.createDatabaseType).toHaveBeenCalledTimes(1);
  });

  it('should create databaseType', () => {
    spyOn(databaseTypeService, 'create').and.callThrough();

    component.model = Object.assign({}, databaseType);
    component.createDatabaseType();

    expect(databaseTypeService.create).toHaveBeenCalled();

    component.createEvent.subscribe(created => {
      expect(created.id).toEqual('123');
    });
  });

  it('should delete databaseType', () => {
    spyOn(databaseTypeService, 'delete').and.callThrough();

    component.model = Object.assign({}, databaseType);
    component.deleteDatabaseType();

    expect(databaseTypeService.delete).toHaveBeenCalled();

    component.deleteEvent.subscribe(deleted => {
      expect(deleted.id).toEqual(databaseType.id);
    });
  });

  it('should update databaseType', () => {
    spyOn(databaseTypeService, 'update').and.callThrough();

    component.model = Object.assign({}, databaseType);
    component.updateDatabaseType();

    expect(databaseTypeService.update).toHaveBeenCalled();

    component.updateEvent.subscribe(updated => {
      expect(updated.id).toEqual(databaseType.id);
    });
  });
});
