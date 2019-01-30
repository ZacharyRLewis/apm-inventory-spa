import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ModalService} from '@win-angular/services';
import {cold, getTestScheduler} from 'jasmine-marbles';
import {FileUploadModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {ApplicationComponent, DependencyUploadComponent, DeploymentComponent, InventoryComponent} from '..';
import {Application, TestDomain, WinResponse} from '../../model';
import {ApplicationService, ApplicationTypeService, DatabaseService, DependencyService, DeploymentService} from '../../services';

class MockApplicationService extends ApplicationService {
  private response: WinResponse<Application[]> = {meta: null, data: [TestDomain.APPLICATION]};

  public findAll(): Observable<WinResponse<Application[]>> {
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

describe('InventoryComponent', () => {
  let component: InventoryComponent;
  let fixture: ComponentFixture<InventoryComponent>;
  let child: ApplicationComponent;
  let child2: DeploymentComponent;
  let child3: DependencyUploadComponent;
  let applicationService: ApplicationService;
  let modalService: ModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, HttpClientTestingModule, TableModule, FileUploadModule],
      declarations: [InventoryComponent, ApplicationComponent, DependencyUploadComponent, DeploymentComponent],
      providers: [
        {provide: ApplicationService, useClass: MockApplicationService},
        ApplicationTypeService, DatabaseService, DeploymentService, DependencyService,
        {provide: ModalService, useClass: MockModalService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryComponent);
    component = fixture.componentInstance;
    child = component.applicationComponent;
    child2 = component.deploymentComponent;
    child3 = component.dependencyUploadComponent;
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

  it('should set passed application in deployment component', () => {
    const application = TestDomain.APPLICATION;
    component.setPassedApplicationOnDeployment(application);

    expect(child2.passedApplication.id).toEqual(application.id);
    expect(child2.model.applicationId).toEqual(application.id);
  });

  it('should set passed application in dependency upload component', () => {
    const application = TestDomain.APPLICATION;
    component.setPassedApplicationOnDependencies(application);

    expect(child3.passedApplication.id).toEqual(application.id);
  });

  it('should open modal', () => {
    spyOn(modalService, 'openModal').and.callThrough();

    component.openModal('application-modal');

    expect(modalService.openModal).toHaveBeenCalled();
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

  it('should handle deployment cancel event', () => {
    spyOn(component, 'setPassedApplication').and.callThrough();
    spyOn(modalService, 'openModal').and.callThrough();
    spyOn(modalService, 'closeModal').and.callThrough();
    component.handleDeploymentCancel(TestDomain.APPLICATION);

    expect(component.setPassedApplication).toHaveBeenCalled();
    expect(modalService.openModal).toHaveBeenCalled();
    expect(modalService.closeModal).toHaveBeenCalled();
  });

  it('should handle deployment create event', () => {
    const application: Application = TestDomain.APPLICATION;
    const deployment: Application = TestDomain.DEPLOYMENT;

    spyOn(component, 'setPassedApplication').and.callThrough();
    spyOn(modalService, 'openModal').and.callThrough();
    spyOn(modalService, 'closeModal').and.callThrough();
    component.handleDeploymentCreate({application, deployment});

    expect(component.setPassedApplication).toHaveBeenCalled();
    expect(modalService.openModal).toHaveBeenCalled();
    expect(modalService.closeModal).toHaveBeenCalled();
    expect(application.deployments.length).toEqual(1);
    expect(application.deployments[0]).toEqual(deployment);
  });
});
