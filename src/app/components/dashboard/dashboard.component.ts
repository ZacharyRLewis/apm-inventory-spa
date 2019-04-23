import {Component, OnInit} from '@angular/core';
import {ShareDataService} from '@win-angular/services';
import {ApplicationDependency, Dependency} from '../../model';
import {ApplicationDependencyService, DependencyService} from '../../services';

@Component({
  selector: 'apm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private readonly TYPE_AHEAD_SIZE: number = 10;

  public selectedTab = 0;
  public tabNames = ['Dependency Search', 'Tab 2', 'Tab 3', 'Tab 4'];
  public applicationDependencies: ApplicationDependency[] = [];
  public dependencies: Dependency[] = [];
  public dependencySuggestions: Dependency[] = [];
  public showDependencySuggestions = false;
  public selectedDependencyReference = '';

  public dependencySearchColumns = [
    {field: 'application.mnemonic', header: 'Application Mnemonic', width: '200px'},
    {field: 'dependency.managerReference', header: 'Dependency Reference', width: '200px'}
  ];

  constructor(private applicationDependencyService: ApplicationDependencyService, private dependencyService: DependencyService,
              private shareDataService: ShareDataService) {
  }

  ngOnInit() {
    this.loadDependencies();
  }

  public toggleTabs(tab: number): void {
    this.selectedTab = tab;
  }

  public findApplicationDependenciesByReference() {
    if (!this.selectedDependencyReference) {
      return;
    }

    const params = [{name: 'reference', value: this.selectedDependencyReference}];
    this.shareDataService.blockUI(true);

    this.applicationDependencyService.filterAll(params)
      .subscribe(response => {
        this.applicationDependencies = response.data;
        this.shareDataService.blockUI(false);
      });
  }

  public loadDependencies = () => {
    this.dependencyService.findAll()
      .subscribe(response => {
        this.dependencies = response.data;
      });
  }

  public processTypeAhead(): void {
    const results: Dependency[] = [];

    if (!this.selectedDependencyReference) {
      return;
    }

    for (const dependency of this.dependencies) {
      if (results.length < this.TYPE_AHEAD_SIZE) {
        const check1 = dependency.managerReference.toLowerCase();
        const check2 = this.selectedDependencyReference.toLowerCase();

        if (check1.indexOf(check2) >= 0) {
            results.push(dependency);
        }
      } else {
        break;
      }

      this.dependencySuggestions = results;
    }
  }

  public showSuggestions(isVisible: boolean) {
    this.showDependencySuggestions = isVisible;
  }

  public selectSuggestion(suggestion: Dependency) {
    this.selectedDependencyReference = suggestion.managerReference;
    this.performSearch();
  }

  public performSearch(): void {
    this.findApplicationDependenciesByReference();
    this.selectedDependencyReference = '';
    this.dependencySuggestions = [];
  }
}
