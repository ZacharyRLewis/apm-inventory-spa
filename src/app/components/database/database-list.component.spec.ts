import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ModalService} from '@win-angular/services';
import {cold, getTestScheduler} from 'jasmine-marbles';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {DatabaseListComponent} from '..';
import {Database, WinResponse} from '../../model';
import {TestDomain} from '../../model/test-domain';
import {ApplicationService, DatabaseService, DatabaseTypeService, DeploymentService} from '../../services';
import {DatabaseComponent} from './database.component';

class MockDatabaseService extends DatabaseService {
  private response: WinResponse<Database[]> = {meta: null, data: [TestDomain.DATABASE]};

  public findAll(): Observable<WinResponse<Database[]>> {
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

describe('DatabaseListComponent', () => {
  let component: DatabaseListComponent;
  let fixture: ComponentFixture<DatabaseListComponent>;
  let child: DatabaseComponent;
  let databaseService: DatabaseService;
  let modalService: ModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, HttpClientTestingModule, TableModule],
      declarations: [DatabaseListComponent, DatabaseComponent],
      providers: [
        {provide: DatabaseService, useClass: MockDatabaseService},
        DatabaseTypeService,
        {provide: ModalService, useClass: MockModalService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseListComponent);
    component = fixture.componentInstance;
    child = component.databaseComponent;
    fixture.detectChanges();
    databaseService = TestBed.get(DatabaseService);
    modalService = TestBed.get(ModalService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch database list on init', () => {
    getTestScheduler().flush();

    expect(component.databases.length).toEqual(1);
    expect(component.databases).toContain(TestDomain.DATABASE);
  });

  it('should reset database component when creating a new database', () => {
    component.resetDatabaseComponent();

    expect(child.passedDatabase).toBe(null);
    expect(child.model.id).toBe(null);
  });

  it('should set passed database in database component', () => {
    const database = TestDomain.DATABASE;
    component.setPassedDatabase(database);

    expect(child.passedDatabase.id).toEqual(database.id);
    expect(child.model.id).toEqual(database.id);
  });

  it('should open modal', () => {
    spyOn(modalService, 'openModal').and.callThrough();

    component.openModal();

    expect(modalService.openModal).toHaveBeenCalled();
  });

  it('should refresh databases on create event', () => {
    spyOn(component, 'refreshDatabases').and.callThrough();
    component.handleCreate(TestDomain.DATABASE);

    expect(component.refreshDatabases).toHaveBeenCalled();
  });

  it('should refresh databases on delete event', () => {
    spyOn(component, 'refreshDatabases').and.callThrough();
    component.handleDelete(TestDomain.DATABASE);

    expect(component.refreshDatabases).toHaveBeenCalled();
  });

  it('should refresh databases on update event', () => {
    spyOn(component, 'refreshDatabases').and.callThrough();
    component.handleUpdate(TestDomain.DATABASE);

    expect(component.refreshDatabases).toHaveBeenCalled();
  });
});
