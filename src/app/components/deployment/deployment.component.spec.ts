import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ModalService} from '@win-angular/services';
import {cold} from 'jasmine-marbles';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {DeploymentComponent} from '..';
import {Deployment, TestDomain, WinResponse} from '../../model';
import {DatabaseService, DeploymentDatabaseService, DeploymentService, MulesoftApiService} from '../../services';

class MockDeploymentService extends DeploymentService {
  private response: WinResponse<Deployment> = {meta: null, data: TestDomain.DEPLOYMENT};

  public create(deployment: Deployment): Observable<WinResponse<Deployment>> {
    return cold('--x|', {x: this.response});
  }

  public update(deployment: Deployment): Observable<WinResponse<Deployment>> {
    return cold('--x|', {x: this.response});
  }

  public delete(deployment: Deployment): Observable<WinResponse<Deployment>> {
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

describe('DeploymentComponent', () => {
  let component: DeploymentComponent;
  let fixture: ComponentFixture<DeploymentComponent>;
  let deploymentService: DeploymentService;
  let modalService: ModalService;
  let deployment: Deployment;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, TableModule],
      declarations: [DeploymentComponent],
      providers: [
        {provide: DeploymentService, useClass: MockDeploymentService},
        DatabaseService, DeploymentDatabaseService, MulesoftApiService,
        {provide: ModalService, useClass: MockModalService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deploymentService = TestBed.get(DeploymentService);
    modalService = TestBed.get(ModalService);
    component.modalId = 'test';
    deployment = TestDomain.DEPLOYMENT;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form values', () => {
    component.setDefaultValues();

    expect(component.model.id).toEqual(null);
    expect(component.model.applicationId).toEqual(null);
    expect(component.model.environment).toEqual('');
    expect(component.model.directory).toEqual('');
    expect(component.model.https).toEqual(null);
    expect(component.model.hostServer).toEqual('');
    expect(component.model.port).toEqual('');
    expect(component.model.contextName).toEqual('');
    expect(component.model.databases).toEqual([]);
    expect(component.model.services).toEqual([]);
  });

  it('should close modal', () => {
    spyOn(modalService, 'closeModal').and.callThrough();

    component.closeModal();

    expect(modalService.closeModal).toHaveBeenCalled();
  });

  it('should call update deployment when passedDeployment exists', () => {
    spyOn(component, 'createDeployment').and.callThrough();
    spyOn(component, 'updateDeployment').and.callThrough();

    component.passedDeployment = Object.assign({}, deployment);
    component.saveDeployment();

    expect(component.updateDeployment).toHaveBeenCalledTimes(1);
    expect(component.createDeployment).toHaveBeenCalledTimes(0);
  });

  it('should call create deployment when passedDeployment doesnt exist', () => {
    spyOn(component, 'createDeployment').and.callThrough();
    spyOn(component, 'updateDeployment').and.callThrough();

    component.passedDeployment = null;
    component.saveDeployment();

    expect(component.updateDeployment).toHaveBeenCalledTimes(0);
    expect(component.createDeployment).toHaveBeenCalledTimes(1);
  });

  it('should create deployment', () => {
    spyOn(deploymentService, 'create').and.callThrough();

    component.model = Object.assign({}, deployment);
    component.createDeployment();

    expect(deploymentService.create).toHaveBeenCalled();

    component.createEvent.subscribe(created => {
      expect(created.id).toEqual('123');
    });
  });

  it('should delete deployment', () => {
    spyOn(deploymentService, 'delete').and.callThrough();

    component.model = Object.assign({}, deployment);
    component.deleteDeployment();

    expect(deploymentService.delete).toHaveBeenCalled();

    component.deleteEvent.subscribe(deleted => {
      expect(deleted.id).toEqual(deployment.id);
    });
  });

  it('should update deployment', () => {
    spyOn(deploymentService, 'update').and.callThrough();

    component.model = Object.assign({}, deployment);
    component.updateDeployment();

    expect(deploymentService.update).toHaveBeenCalled();

    component.updateEvent.subscribe(updated => {
      expect(updated.id).toEqual(deployment.id);
    });
  });
});
