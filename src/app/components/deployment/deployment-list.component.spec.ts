import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ModalService} from '@win-angular/services';
import {cold, getTestScheduler} from 'jasmine-marbles';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {Deployment, WinResponse} from '../../model';
import {TestDomain} from '../../model/test-domain';
import {ApplicationService, DeploymentService} from '../../services';
import {DeploymentListComponent} from './deployment-list.component';
import {DeploymentComponent} from './deployment.component';

class MockDeploymentService extends DeploymentService {
  private response: WinResponse<Deployment[]> = {meta: null, data: [TestDomain.DEPLOYMENT]};

  public findAll(): Observable<WinResponse<Deployment[]>> {
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

describe('DeploymentListComponent', () => {
  let component: DeploymentListComponent;
  let fixture: ComponentFixture<DeploymentListComponent>;
  let child: DeploymentComponent;
  let deploymentService: DeploymentService;
  let modalService: ModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, HttpClientTestingModule, TableModule],
      declarations: [DeploymentListComponent, DeploymentComponent],
      providers: [
        {provide: DeploymentService, useClass: MockDeploymentService},
        ApplicationService,
        {provide: ModalService, useClass: MockModalService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentListComponent);
    component = fixture.componentInstance;
    child = component.deploymentComponent;
    fixture.detectChanges();
    deploymentService = TestBed.get(DeploymentService);
    modalService = TestBed.get(ModalService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch deployment list on init', () => {
    getTestScheduler().flush();

    expect(component.deployments.length).toEqual(1);
    expect(component.deployments).toContain(TestDomain.DEPLOYMENT);
  });

  it('should reset deployment component when creating a new deployment', () => {
    component.resetDeploymentComponent();

    expect(child.passedDeployment).toBe(null);
    expect(child.model.id).toBe(null);
  });

  it('should set passed deployment in deployment component', () => {
    const deployment = TestDomain.DEPLOYMENT;
    component.setPassedDeployment(deployment);

    expect(child.passedDeployment.id).toEqual(deployment.id);
    expect(child.model.id).toEqual(deployment.id);
  });

  it('should open modal', () => {
    spyOn(modalService, 'openModal').and.callThrough();

    component.openModal();

    expect(modalService.openModal).toHaveBeenCalled();
  });

  it('should refresh deployments on create event', () => {
    spyOn(component, 'refreshDeployments').and.callThrough();
    component.handleCreate(TestDomain.DEPLOYMENT);

    expect(component.refreshDeployments).toHaveBeenCalled();
  });

  it('should refresh deployments on delete event', () => {
    spyOn(component, 'refreshDeployments').and.callThrough();
    component.handleDelete(TestDomain.DEPLOYMENT);

    expect(component.refreshDeployments).toHaveBeenCalled();
  });

  it('should refresh deployments on update event', () => {
    spyOn(component, 'refreshDeployments').and.callThrough();
    component.handleUpdate(TestDomain.DEPLOYMENT);

    expect(component.refreshDeployments).toHaveBeenCalled();
  });
});
