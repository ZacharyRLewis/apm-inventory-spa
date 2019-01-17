import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ModalService} from '@win-angular/services';
import {cold} from 'jasmine-marbles';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {Database, WinResponse} from '../../model';
import {TestDomain} from '../../model/test-domain';
import {DatabaseService} from '../../services';
import {DatabaseComponent} from './database.component';

class MockDatabaseService extends DatabaseService {
  private response: WinResponse<Database> = {meta: null, data: TestDomain.DATABASE};

  public create(database: Database): Observable<WinResponse<Database>> {
    return cold('--x|', {x: this.response});
  }

  public update(database: Database): Observable<WinResponse<Database>> {
    return cold('--x|', {x: this.response});
  }

  public delete(database: Database): Observable<WinResponse<Database>> {
    return cold('--x|', {x: this.response});
  }
}

describe('DatabaseComponent', () => {
  let component: DatabaseComponent;
  let fixture: ComponentFixture<DatabaseComponent>;
  let databaseService: DatabaseService;
  let modalService: ModalService;
  let database: Database;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, TableModule],
      declarations: [DatabaseComponent],
      providers: [{provide: DatabaseService, useClass: MockDatabaseService}, ModalService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    databaseService = TestBed.get(DatabaseService);
    modalService = TestBed.get(ModalService);
    // modalService.modals = [TestDomain.TEST_MODAL];
    component.modalId = 'test';
    database = TestDomain.DATABASE;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form values', () => {
    component.setDefaultValues();

    expect(component.model.id).toEqual(null);
    expect(component.model.name).toEqual('');
    expect(component.model.hostName).toEqual('');
    expect(component.model.port).toEqual('');
    expect(component.model.type.name).toEqual('');
    expect(component.model.environment).toEqual('');
  });

  it('should close modal', () => {
    spyOn(modalService, 'closeModal').and.callThrough();

    component.closeModal();

    expect(modalService.closeModal).toHaveBeenCalled();
  });

  it('should call update database when passedDatabase exists', () => {
    spyOn(component, 'createDatabase').and.callThrough();
    spyOn(component, 'updateDatabase').and.callThrough();

    component.passedDatabase = Object.assign({}, database);
    component.saveDatabase();

    expect(component.updateDatabase).toHaveBeenCalledTimes(1);
    expect(component.createDatabase).toHaveBeenCalledTimes(0);
  });

  it('should call create database when passedDatabase doesnt exist', () => {
    spyOn(component, 'createDatabase').and.callThrough();
    spyOn(component, 'updateDatabase').and.callThrough();

    component.passedDatabase = null;
    component.saveDatabase();

    expect(component.updateDatabase).toHaveBeenCalledTimes(0);
    expect(component.createDatabase).toHaveBeenCalledTimes(1);
  });

  it('should create database', () => {
    spyOn(databaseService, 'create').and.callThrough();

    component.model = Object.assign({}, database);
    component.createDatabase();

    expect(databaseService.create).toHaveBeenCalled();

    component.createEvent.subscribe(created => {
      expect(created.id).toEqual('123');
    });
  });

  it('should delete database', () => {
    spyOn(databaseService, 'delete').and.callThrough();

    component.model = Object.assign({}, database);
    component.deleteDatabase();

    expect(databaseService.delete).toHaveBeenCalled();

    component.deleteEvent.subscribe(deleted => {
      expect(deleted.id).toEqual(database.id);
    });
  });

  it('should update database', () => {
    spyOn(databaseService, 'update').and.callThrough();

    component.model = Object.assign({}, database);
    component.updateDatabase();

    expect(databaseService.update).toHaveBeenCalled();

    component.updateEvent.subscribe(updated => {
      expect(updated.id).toEqual(database.id);
    });
  });
});
