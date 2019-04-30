import {Renderer2, Type} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ChipsComponentModule} from '@win-angular/chips-component';
import {SelectComponentModule} from '@win-angular/select-component';
import {AutoCompleteModule, SidebarModule} from 'primeng/primeng';
import {ApplicationFilters, TestDomain} from '../../model';
import {ApplicationFlyoutFilterComponent} from './application-flyout-filter.component';

describe('ApplicationFlyoutFilterComponent', () => {
  let component: ApplicationFlyoutFilterComponent;
  let fixture: ComponentFixture<ApplicationFlyoutFilterComponent>;
  let renderer: Renderer2;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AutoCompleteModule, BrowserAnimationsModule, ChipsComponentModule, FormsModule, SelectComponentModule, SidebarModule],
      declarations: [ApplicationFlyoutFilterComponent],
      providers: [Renderer2]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationFlyoutFilterComponent);
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

    const applicationFilters = new ApplicationFilters('test');
    component.filters = applicationFilters;
    component.filterFields = {mnemonic: 'Application Mnemonic'};
    component.applyFilters();

    expect(component.chipList.length).toEqual(1);
    expect(component.hideSidebar).toHaveBeenCalledTimes(1);
  });

  it('should clear filters', () => {
    const applicationFilters = new ApplicationFilters('test', 'test', true, '1');
    component.filters = applicationFilters;
    component.clearFilters();

    expect(component.filters.mnemonic).toEqual('');
    expect(component.filters.isServiceApi).toBeFalsy();
    expect(component.filters.applicationTypeId).toEqual('');
  });

  it('should remove one filter', () => {
    const applicationFilters = new ApplicationFilters('test', 'test', true, '1');
    const event = 'mnemonic';
    component.filters = applicationFilters;
    component.removeFilter(event);

    expect(component.filters.mnemonic).toEqual('');
    expect(component.filters.isServiceApi).toBeTruthy();
    expect(component.filters.applicationTypeId).toEqual('1');
  });

  it('should remove all filters', () => {
    const applicationFilters = new ApplicationFilters('test', 'test', true, '1');
    component.filters = applicationFilters;
    component.removeFilter();

    expect(component.filters.mnemonic).toEqual('');
    expect(component.filters.isServiceApi).toBeFalsy();
    expect(component.filters.applicationTypeId).toEqual('');
  });

  it('should identify if form is clear', () => {
    const check1: boolean = component.isFormClear();
    expect(check1).toBeTruthy();

    const applicationFilters = new ApplicationFilters('test', 'test', true, '1');
    component.filters = applicationFilters;

    const check2: boolean = component.isFormClear();
    expect(check2).toBeFalsy();
  });

  it('should select a suggestion', () => {
    component.selectAppMnemonicSuggestion('selectedSuggestion');

    expect(component.filters.mnemonic).toEqual('selectedSuggestion');
    expect(component.appMnemonicSuggestions.length).toEqual(0);
  });

  it('should process typeaheads correctly', () => {
    const applicationFilters1 = new ApplicationFilters('test');
    component.filters = applicationFilters1;
    component.applications = [TestDomain.APPLICATION];

    component.processAppMnemonicTypeAhead();

    expect(component.appMnemonicSuggestions.length).toEqual(1);

    const applicationFilters2 = new ApplicationFilters('typeahead');
    component.filters = applicationFilters2;
    component.applications = [TestDomain.APPLICATION];

    component.processAppMnemonicTypeAhead();

    expect(component.appMnemonicSuggestions.length).toEqual(0);

    const applicationFilters3 = new ApplicationFilters();
    component.filters = applicationFilters3;

    component.processAppMnemonicTypeAhead();

    expect(component.appMnemonicSuggestions.length).toEqual(0);
  });
});
