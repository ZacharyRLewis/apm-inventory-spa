import {Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, ViewChild} from '@angular/core';
import {DeploymentFilters} from '../../model/deployment-filters';
import {Application, HostServer} from '../../model/index';

@Component({
  selector: 'apm-deployment-flyout-filter',
  templateUrl: './deployment-flyout-filter.component.html',
  styleUrls: ['./deployment-flyout-filter.component.scss']
})
export class DeploymentFlyoutFilterComponent {

  private readonly TYPE_AHEAD_SIZE: number = 10;

  @Input()
  public applications: Application[];

  @Input()
  public hostServers: HostServer[];

  @Output('filter')
  public filter: EventEmitter<any> = new EventEmitter();

  @Output('clear')
  public clear: EventEmitter<void> = new EventEmitter();

  @ViewChild('filterBtn', {read: ElementRef})
  private filterBtn: ElementRef = null;

  @ViewChild('sidebar', {read: ElementRef})
  private sidebar: ElementRef = null;

  public filters = new DeploymentFilters();
  public isSidebarVisible = false;
  public environmentChoices = [{key: 'DEV', value: 'DEV'}, {key: 'QA', value: 'QA'}, {key: 'PROD', value: 'PROD'}];
  public chipList = [];
  public filterFields;
  public appNameSuggestions: Application[] = [];
  public selectedAppName = '';

  constructor(private renderer: Renderer2) {
    this.filterFields = {
      applicationId: 'Application',
      environment: 'Environment',
      hostServerId: 'Host Server'
    };
  }

  public showSidebar(): void {
    this.renderer.addClass(this.filterBtn.nativeElement, 'btn-hide');
    this.renderer.removeClass(this.sidebar.nativeElement, 'hidden');
    this.renderer.addClass(document.body, 'modal-open');
    setTimeout(() => {
      this.isSidebarVisible = true;
    }, 500);
  }

  public hideSidebar(): void {
    setTimeout(() => {
      this.renderer.addClass(this.sidebar.nativeElement, 'hidden');
      this.renderer.removeClass(this.filterBtn.nativeElement, 'btn-hide');
      if (this.isSidebarVisible) {
        this.isSidebarVisible = false;
        document.body.className = document.body.className.replace('modal-open', '');
      }
    }, 500);
  }

  public applyFilters(): void {
    this.chipList = [];
    for (const key in this.filters) {
      if (this.filters[key] && this.filterFields[key]) {
        this.chipList.push({label: this.filterFields[key], name: key});
      }
    }
    this.filter.emit(this.filters);
    this.hideSidebar();
  }

  public clearFilters(): void {
    const self = this;
    const keys = Object.keys(this.filters);
    keys.forEach(function (key) {
      self.filters[key] = '';
    });
    this.selectedAppName = '';
    this.chipList = [];
    this.clear.emit();
  }

  public removeFilter(event?): void {
    if (event) {
      this.filters[event] = '';
      if (event === 'applicationId') {
        this.selectedAppName = '';
      }
    } else {
      this.clearFilters();
      this.selectedAppName = '';
    }

    this.applyFilters();
  }

  public isFormClear(): boolean {
    const self = this;
    const keys = Object.keys(this.filters);
    const formClear = keys.some(function (key) {
      return self.filters[key] !== null && typeof self.filters[key] !== 'undefined' && self.filters[key].length !== 0;
    });
    return !formClear;
  }

  @HostListener('document:click', ['$event'])
  public onClick(event): void {
    const whiteListedElement = event.path.filter(item => {
      let hasClass: boolean;
      if (item.classList) {
        hasClass = item.classList.contains('ui-sidebar') || item.classList.contains('fa-search');
      } else {
        hasClass = false;
      }
      return hasClass;
    });
    if (whiteListedElement.length <= 0
      && event.target !== this.sidebar.nativeElement
      && event.target !== this.filterBtn.nativeElement) {
      this.hideSidebar();
    }
  }

  public selectAppNameSuggestion(suggestion: Application) {
    this.selectedAppName = suggestion.name;
    this.filters.applicationId = suggestion.id;
    this.appNameSuggestions = [];
  }

  public processAppNameTypeAhead(): void {
    const results: Application[] = [];

    if (!this.selectedAppName || this.selectedAppName === '') {
      this.appNameSuggestions = results;
      return;
    }

    for (const application of this.applications) {
      if (results.length < this.TYPE_AHEAD_SIZE) {
        const check1 = application.name.toLowerCase();
        const check2 = this.selectedAppName.toLowerCase();

        if (check1.indexOf(check2) >= 0) {
          results.push(application);
        }
      } else {
        break;
      }

      this.appNameSuggestions = results;
    }
  }
}
