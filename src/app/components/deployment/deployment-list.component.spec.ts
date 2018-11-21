import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {cold, getTestScheduler} from 'jasmine-marbles';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {ModalComponent} from '..';
import {Application, WinResponse} from '../../model';
import {TestDomain} from '../../model/test-domain';
import {ApplicationService, ModalService} from '../../services';
import {ApplicationComponent} from '../application/application.component';
import {DeploymentsComponent} from './inventory.component';

class MockApplicationService extends ApplicationService {
  private response: WinResponse<Application[]> = {meta: null, data: [TestDomain.APPLICATION]};

  public findAll(): Observable<WinResponse<Application[]>> {
    return cold('--x|', {x: this.response});
  }
}

describe('InventoryComponent', () => {
  let component: DeploymentsComponent;
  let fixture: ComponentFixture<DeploymentsComponent>;
  let child: ApplicationComponent;
  let applicationService: ApplicationService;
  let modalService: ModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, HttpClientTestingModule, TableModule],
      declarations: [DeploymentsComponent, ApplicationComponent, ModalComponent],
      providers: [{provide: ApplicationService, useClass: MockApplicationService}, ModalService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentsComponent);
    component = fixture.componentInstance;
    child = component.applicationComponent;
    fixture.detectChanges();
    applicationService = TestBed.get(ApplicationService);
    modalService = TestBed.get(ModalService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch application list on init', () => {
    getTestScheduler().flush();

    expect(component.applications.length).toEqual(1);
    expect(component.applications).toContain(TestDomain.APPLICATION);
  });

  it('should reset application component when creating a new application', () => {
    component.resetApplicationComponent();

    expect(child.passedApplication).toBe(null);
    expect(child.model.id).toBe(null);
  });

  it('should set passed application in application component', () => {
    const application = TestDomain.APPLICATION;
    component.setPassedApplication(application);

    expect(child.passedApplication.id).toEqual(application.id);
    expect(child.model.id).toEqual(application.id);
  });

  it('should open modal', () => {
    spyOn(modalService, 'open').and.callThrough();

    component.openModal();

    expect(modalService.open).toHaveBeenCalled();
  });

  it('should refresh applications on create event', () => {
    spyOn(component, 'refreshApplications').and.callThrough();
    component.handleCreate(TestDomain.APPLICATION);

    expect(component.refreshApplications).toHaveBeenCalled();
  });

  it('should refresh applications on delete event', () => {
    spyOn(component, 'refreshApplications').and.callThrough();
    component.handleDelete(TestDomain.APPLICATION);

    expect(component.refreshApplications).toHaveBeenCalled();
  });

  it('should refresh applications on update event', () => {
    spyOn(component, 'refreshApplications').and.callThrough();
    component.handleUpdate(TestDomain.APPLICATION);

    expect(component.refreshApplications).toHaveBeenCalled();
  });
});
