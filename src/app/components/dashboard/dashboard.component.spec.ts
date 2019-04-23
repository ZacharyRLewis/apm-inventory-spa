import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ShareDataService} from '@win-angular/services';
import {AutoCompleteModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {TestDomain} from '../../model';
import {ApplicationDependencyService, DependencyService} from '../../services';

import {DashboardComponent} from './dashboard.component';

class MockShareDataService extends ShareDataService {
  blockUI(isBlockUI: boolean) {
    console.log('block ui = ' + isBlockUI);
  }
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let applicationDependencyService: ApplicationDependencyService;
  let dependencyService: DependencyService;
  let shareDataService: ShareDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AutoCompleteModule, FormsModule, HttpClientModule, HttpClientTestingModule, TableModule],
      declarations: [DashboardComponent],
      providers: [
        ApplicationDependencyService, DependencyService,
        {provide: ShareDataService, useClass: MockShareDataService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    applicationDependencyService = TestBed.get(ApplicationDependencyService);
    dependencyService = TestBed.get(DependencyService);
    shareDataService = TestBed.get(ShareDataService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not filter application dependencies if no manager reference exists', () => {
    spyOn(shareDataService, 'blockUI').and.callThrough();
    spyOn(applicationDependencyService, 'filterAll').and.callThrough();

    component.selectedDependencyReference = null;
    component.findApplicationDependenciesByReference();

    expect(shareDataService.blockUI).toHaveBeenCalledTimes(0);
    expect(applicationDependencyService.filterAll).toHaveBeenCalledTimes(0);
  });

  it('should find application dependencies by manager reference', () => {
    spyOn(shareDataService, 'blockUI').and.callThrough();
    spyOn(applicationDependencyService, 'filterAll').and.callThrough();

    component.selectedDependencyReference = 'test';
    component.findApplicationDependenciesByReference();

    const params = [{name: 'reference', value: 'test'}];

    expect(shareDataService.blockUI).toHaveBeenCalledTimes(1);
    expect(applicationDependencyService.filterAll).toHaveBeenCalledWith(params);
  });

  it('should toggle suggestions', () => {
    expect(component.showDependencySuggestions).toBeFalsy();

    component.showSuggestions(true);
    expect(component.showDependencySuggestions).toBeTruthy();

    component.showSuggestions(false);
    expect(component.showDependencySuggestions).toBeFalsy();
  });

  it('should select a suggestion', () => {
    spyOn(component, 'performSearch').and.callThrough();

    const dependency = TestDomain.DEPENDENCY;
    component.selectSuggestion(dependency);

    expect(component.performSearch).toHaveBeenCalledTimes(1);
  });

  it('should perform search', () => {
    spyOn(component, 'findApplicationDependenciesByReference').and.callThrough();

    component.selectedDependencyReference = 'test';
    component.performSearch();

    expect(component.findApplicationDependenciesByReference).toHaveBeenCalledTimes(1);
    expect(component.selectedDependencyReference).toEqual('');
    expect(component.dependencySuggestions.length).toEqual(0);
  });

  it('should process typeaheads correctly', () => {
    component.selectedDependencyReference = 'test';
    component.dependencies = [TestDomain.DEPENDENCY];

    component.processTypeAhead();

    expect(component.dependencySuggestions.length).toEqual(1);

    component.selectedDependencyReference = 'typeahead';
    component.dependencies = [TestDomain.DEPENDENCY];

    component.processTypeAhead();

    expect(component.dependencySuggestions.length).toEqual(0);

    component.selectedDependencyReference = '';

    component.processTypeAhead();

    expect(component.dependencySuggestions.length).toEqual(0);
  });
});
