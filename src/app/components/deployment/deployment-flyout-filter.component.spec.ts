import {Renderer2, Type} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ChipsComponentModule} from '@win-angular/chips-component';
import {SelectComponentModule} from '@win-angular/select-component';
import {SidebarModule} from 'primeng/primeng';
import {DeploymentFilters, TestDomain} from '../../model';
import {DeploymentFlyoutFilterComponent} from './deployment-flyout-filter.component';

describe('DeploymentFlyoutFilterComponent', () => {
  let component: DeploymentFlyoutFilterComponent;
  let fixture: ComponentFixture<DeploymentFlyoutFilterComponent>;
  let renderer: Renderer2;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, BrowserAnimationsModule, ChipsComponentModule, SelectComponentModule, SidebarModule],
      declarations: [DeploymentFlyoutFilterComponent],
      providers: [Renderer2]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentFlyoutFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show sidebar flyout', () => {
    spyOn(renderer, 'addClass').and.callThrough();
    spyOn(renderer, 'removeClass').and.callThrough();

    component.showSidebar();

    expect(renderer.addClass).toHaveBeenCalledWith(jasmine.any(Object), 'btn-hide');
    expect(renderer.removeClass).toHaveBeenCalledWith(jasmine.any(Object), 'hidden');
    expect(renderer.addClass).toHaveBeenCalledWith(jasmine.any(Object), 'modal-open');
  });

  it('should apply filters and hide sidebar flyout', () => {
    spyOn(component, 'hideSidebar').and.callThrough();

    const deploymentFilters = new DeploymentFilters('1');
    component.filters = deploymentFilters;
    component.filterFields = {applicationId: 'Application'};
    component.applyFilters();

    expect(component.chipList.length).toEqual(1);
    expect(component.hideSidebar).toHaveBeenCalledTimes(1);
  });

  it('should clear filters', () => {
    const deploymentFilters = new DeploymentFilters('1', 'DEV;', '1');
    component.filters = deploymentFilters;
    component.clearFilters();

    expect(component.filters.applicationId).toEqual('');
    expect(component.filters.environment).toEqual('');
    expect(component.filters.hostServerId).toEqual('');
  });

  it('should remove one filter', () => {
    const deploymentFilters = new DeploymentFilters('1', 'DEV', '1');
    const event = 'applicationId';
    component.filters = deploymentFilters;
    component.removeFilter(event);

    expect(component.filters.applicationId).toEqual('');
    expect(component.filters.environment).toEqual('DEV');
    expect(component.filters.hostServerId).toEqual('1');
  });

  it('should remove all filters', () => {
    const deploymentFilters = new DeploymentFilters('1', 'DEV', '1');
    component.filters = deploymentFilters;
    component.removeFilter();

    expect(component.filters.applicationId).toEqual('');
    expect(component.filters.environment).toEqual('');
    expect(component.filters.hostServerId).toEqual('');
  });

  it('should identify if form is clear', () => {
    const check1: boolean = component.isFormClear();
    expect(check1).toBeTruthy();

    const deploymentFilters = new DeploymentFilters('1', 'DEV', '1');
    component.filters = deploymentFilters;

    const check2: boolean = component.isFormClear();
    expect(check2).toBeFalsy();
  });

  it('should toggle suggestions', () => {
    expect(component.showAppMnemonicSuggestions).toBeFalsy();

    component.showSuggestions(true);
    expect(component.showAppMnemonicSuggestions).toBeTruthy();

    component.showSuggestions(false);
    expect(component.showAppMnemonicSuggestions).toBeFalsy();
  });

  it('should select a suggestion', () => {
    const application = TestDomain.APPLICATION;
    component.selectSuggestion(application);

    expect(component.selectedAppMnemonic).toEqual(application.mnemonic);
    expect(component.filters.applicationId).toEqual(application.id);
    expect(component.showAppMnemonicSuggestions).toBeFalsy();
    expect(component.appMnemonicSuggestions.length).toEqual(0);
  });

  it('should process typeaheads correctly', () => {
    component.selectedAppMnemonic = 'test';
    component.applications = [TestDomain.APPLICATION];

    component.processTypeAhead();

    expect(component.appMnemonicSuggestions.length).toEqual(1);

    component.selectedAppMnemonic = 'typeahead';
    component.applications = [TestDomain.APPLICATION];

    component.processTypeAhead();

    expect(component.appMnemonicSuggestions.length).toEqual(0);

    component.selectedAppMnemonic = '';

    component.processTypeAhead();

    expect(component.appMnemonicSuggestions.length).toEqual(0);
  });
});
