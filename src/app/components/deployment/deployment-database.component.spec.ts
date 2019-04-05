import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ModalService} from '@win-angular/services';
import {cold} from 'jasmine-marbles';
import {TableModule} from 'primeng/table';
import {Observable} from 'rxjs';
import {DeploymentDatabase, TestDomain, WinResponse} from '../../model';
import {DatabaseService, DeploymentDatabaseService} from '../../services';
import {DeploymentDatabaseComponent} from './deployment-database.component';

class MockDeploymentDatabaseService extends DeploymentDatabaseService {
  private response: WinResponse<DeploymentDatabase[]> = {meta: null, data: [TestDomain.DEPLOYMENT_DATABASE]};

  public create(deploymentDatabase: DeploymentDatabase): Observable<WinResponse<DeploymentDatabase>> {
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

describe('DeploymentDatabaseComponent', () => {
  let component: DeploymentDatabaseComponent;
  let fixture: ComponentFixture<DeploymentDatabaseComponent>;
  let deploymentDatabaseService: DeploymentDatabaseService;
  let modalService: ModalService;
  let deploymentDatabase: DeploymentDatabase;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, TableModule],
      declarations: [DeploymentDatabaseComponent],
      providers: [
        DatabaseService,
        {provide: DeploymentDatabaseService, useClass: MockDeploymentDatabaseService},
        {provide: ModalService, useClass: MockModalService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deploymentDatabaseService = TestBed.get(DeploymentDatabaseService);
    modalService = TestBed.get(ModalService);
    component.modalId = 'test';
    deploymentDatabase = TestDomain.DEPLOYMENT_DATABASE;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form values', () => {
    component.setDefaultValues();

    expect(component.passedDeployment.id).toEqual('');
  });

  it('should close modal', () => {
    spyOn(modalService, 'closeModal').and.callThrough();

    component.closeModal();

    expect(modalService.closeModal).toHaveBeenCalled();
  });

  it('should add deployment database to deployment', () => {
    spyOn(deploymentDatabaseService, 'create').and.callThrough();

    component.model = Object.assign({}, deploymentDatabase);
    component.passedDeployment = TestDomain.DEPLOYMENT;
    component.addToDeployment();

    expect(deploymentDatabaseService.create).toHaveBeenCalled();

    component.addDatabaseEvent.subscribe(deployment => {
      expect(deployment.id).toEqual('123');
    });
  });
});
