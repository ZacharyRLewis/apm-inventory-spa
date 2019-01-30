import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ModalService} from '@win-angular/services';
import {FileUpload, FileUploadModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {DependencyUploadComponent} from '..';
import {Dependency, TestDomain, WinResponse} from '../../model';
import {DependencyService} from '../../services';

class MockDependencyService extends DependencyService {
  private response: WinResponse<Dependency[]> = {meta: null, data: [TestDomain.DEPENDENCY]};

  public uploadDependencies(event, applicationId): Promise<WinResponse<Dependency[]>> {
    return new Promise((resolve, reject) => {
      resolve(this.response);
    });
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

describe('DependencyUploadComponent', () => {
  let component: DependencyUploadComponent;
  let fixture: ComponentFixture<DependencyUploadComponent>;
  let child: FileUpload;
  let dependencyService: DependencyService;
  let modalService: ModalService;
  let database: Dependency;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, TableModule, FileUploadModule],
      declarations: [DependencyUploadComponent],
      providers: [
        {provide: DependencyService, useClass: MockDependencyService},
        {provide: ModalService, useClass: MockModalService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DependencyUploadComponent);
    component = fixture.componentInstance;
    child = component.fileUpload;
    fixture.detectChanges();
    dependencyService = TestBed.get(DependencyService);
    modalService = TestBed.get(ModalService);
    component.modalId = 'test';
    database = TestDomain.DATABASE;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form values', () => {
    component.setDefaultValues();

    expect(component.passedApplication.id).toEqual('');
  });

  it('should close modal', () => {
    spyOn(modalService, 'closeModal').and.callThrough();

    component.closeModal();

    expect(modalService.closeModal).toHaveBeenCalled();
  });

  it('should upload dependencies', () => {
    spyOn(dependencyService, 'uploadDependencies').and.callThrough();

    component.passedApplication = Object.assign({}, TestDomain.APPLICATION);
    component.customUpload({});

    expect(dependencyService.uploadDependencies).toHaveBeenCalled();

    component.uploadAppDependenciesEvent.subscribe(application => {
      expect(application.dependencies.length).toEqual(1);
    });
  });

  it('should add to application', () => {
    spyOn(child, 'upload').and.callThrough();

    component.addToApplication();

    expect(child.upload).toHaveBeenCalled();
  });

  it('should go back to application', () => {
    spyOn(child, 'clear').and.callThrough();
    spyOn(component, 'cancelUpload').and.callThrough();

    component.backToApplication();

    expect(component.cancelUpload).toHaveBeenCalled();
    expect(child.clear).toHaveBeenCalled();

    component.cancelAppDependenciesEvent.subscribe(application => {
      expect(application.dependencies.length).toEqual(0);
    });
  });
});
