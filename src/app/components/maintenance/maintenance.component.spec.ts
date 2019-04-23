import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ModalService} from '@win-angular/services';
import {cold, getTestScheduler} from 'jasmine-marbles';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {ApplicationTypeComponent, DatabaseComponent, DatabaseTypeComponent, HostServerComponent, MaintenanceComponent} from '..';
import {ApplicationType, Database, DatabaseType, HostServer, TestDomain, WinResponse} from '../../model';
import {ApplicationTypeService, DatabaseService, DatabaseTypeService, HostServerService} from '../../services';

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

class MockDatabaseService extends DatabaseService {
  private response: WinResponse<Database[]> = {meta: null, data: [TestDomain.DATABASE]};

  public findAll(): Observable<WinResponse<Database[]>> {
    return cold('--x|', {x: this.response});
  }
}

class MockHostServerService extends HostServerService {
  private response: WinResponse<HostServer[]> = {meta: null, data: [TestDomain.HOST_SERVER]};

  public findAll(): Observable<WinResponse<HostServer[]>> {
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

describe('MaintenanceComponent', () => {
  let component: MaintenanceComponent;
  let fixture: ComponentFixture<MaintenanceComponent>;
  let child: ApplicationTypeComponent;
  let child2: DatabaseTypeComponent;
  let child3: DatabaseComponent;
  let child4: HostServerComponent;
  let applicationTypeService: ApplicationTypeService;
  let modalService: ModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, HttpClientTestingModule, TableModule],
      declarations: [MaintenanceComponent, ApplicationTypeComponent, DatabaseTypeComponent, DatabaseComponent, HostServerComponent],
      providers: [
        {provide: ApplicationTypeService, useClass: MockApplicationTypeService},
        {provide: DatabaseTypeService, useClass: MockDatabaseTypeService},
        {provide: DatabaseService, useClass: MockDatabaseService},
        {provide: HostServerService, useClass: MockHostServerService},
        {provide: ModalService, useClass: MockModalService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceComponent);
    component = fixture.componentInstance;
    child = component.applicationTypeComponent;
    child2 = component.databaseTypeComponent;
    child3 = component.databaseComponent;
    child4 = component.hostServerComponent;
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

  it('should fetch database list on init', () => {
    getTestScheduler().flush();

    expect(component.databases.length).toEqual(1);
    expect(component.databases).toContain(TestDomain.DATABASE);
  });

  it('should fetch host server list on init', () => {
    getTestScheduler().flush();

    expect(component.hostServers.length).toEqual(1);
    expect(component.hostServers).toContain(TestDomain.HOST_SERVER);
  });

  it('should reset applicationType component when creating a new applicationType', () => {
    component.resetApplicationTypeComponent();

    expect(child.passedApplicationType).toBe(null);
    expect(child.model.id).toBe(null);
  });

  it('should reset databaseType component when creating a new databaseType', () => {
    component.resetDatabaseTypeComponent();

    expect(child2.passedDatabaseType).toBe(null);
    expect(child2.model.id).toBe(null);
  });

  it('should reset database component when creating a new database', () => {
    component.resetDatabaseComponent();

    expect(child3.passedDatabase).toBe(null);
    expect(child3.model.id).toBe(null);
  });

  it('should reset hostServer component when creating a new hostServer', () => {
    component.resetHostServerComponent();

    expect(child4.passedHostServer).toBe(null);
    expect(child4.model.id).toBe(null);
  });

  it('should set passed applicationType in applicationType component', () => {
    const applicationType = TestDomain.APPLICATION_TYPE;
    component.prepareApplicationTypeModal(applicationType);

    expect(child.passedApplicationType.id).toEqual(applicationType.id);
    expect(child.model.id).toEqual(applicationType.id);
  });

  it('should set passed databaseType in databaseType component', () => {
    const databaseType = TestDomain.DATABASE_TYPE;
    component.prepareDatabaseTypeModal(databaseType);

    expect(child2.passedDatabaseType.id).toEqual(databaseType.id);
    expect(child2.model.id).toEqual(databaseType.id);
  });

  it('should set passed database in database component', () => {
    const database = TestDomain.DATABASE;
    component.prepareDatabaseModal(database);

    expect(child3.passedDatabase.id).toEqual(database.id);
    expect(child3.model.id).toEqual(database.id);
  });

  it('should set passed hostServer in hostServer component', () => {
    const hostServer = TestDomain.HOST_SERVER;
    component.prepareHostServerModal(hostServer);

    expect(child4.passedHostServer.id).toEqual(hostServer.id);
    expect(child4.model.id).toEqual(hostServer.id);
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

  it('should open database modal', () => {
    spyOn(modalService, 'openModal').and.callThrough();

    component.openModal('database-modal');

    expect(modalService.openModal).toHaveBeenCalled();
  });

  it('should open host server modal', () => {
    spyOn(modalService, 'openModal').and.callThrough();

    component.openModal('host-server-modal');

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

  it('should refresh databases on create event', () => {
    spyOn(component, 'refreshDatabases').and.callThrough();
    component.handleDatabaseCreate(TestDomain.DATABASE);

    expect(component.refreshDatabases).toHaveBeenCalled();
  });

  it('should refresh databases on delete event', () => {
    spyOn(component, 'refreshDatabases').and.callThrough();
    component.handleDatabaseDelete(TestDomain.DATABASE);

    expect(component.refreshDatabases).toHaveBeenCalled();
  });

  it('should refresh databases on update event', () => {
    spyOn(component, 'refreshDatabases').and.callThrough();
    component.handleDatabaseUpdate(TestDomain.DATABASE);

    expect(component.refreshDatabases).toHaveBeenCalled();
  });

  it('should refresh hostServers on create event', () => {
    spyOn(component, 'refreshHostServers').and.callThrough();
    component.handleHostServerCreate(TestDomain.HOST_SERVER);

    expect(component.refreshHostServers).toHaveBeenCalled();
  });

  it('should refresh hostServers on delete event', () => {
    spyOn(component, 'refreshHostServers').and.callThrough();
    component.handleHostServerDelete(TestDomain.HOST_SERVER);

    expect(component.refreshHostServers).toHaveBeenCalled();
  });

  it('should refresh hostServers on update event', () => {
    spyOn(component, 'refreshHostServers').and.callThrough();
    component.handleHostServerUpdate(TestDomain.HOST_SERVER);

    expect(component.refreshHostServers).toHaveBeenCalled();
  });
});
