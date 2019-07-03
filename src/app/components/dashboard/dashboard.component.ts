import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalService, ShareDataService} from '@win-angular/services';
import {Application, ApplicationDependency, Dependency, Deployment, DeploymentDatabase, HostServer} from '../../model';
import {
  ApplicationDependencyService,
  ApplicationService,
  DependencyService,
  DeploymentDatabaseService,
  DeploymentService,
  HostServerService
} from '../../services';
import {FindAvailablePortComponent} from './find-available-port.component';

@Component({
  selector: 'apm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private readonly TYPE_AHEAD_SIZE: number = 10;

  // Lookup lists
  public applications: Application[] = [];
  public dependencies: Dependency[] = [];
  public deployments: Deployment[] = [];
  public hostServers: HostServer[] = [];
  public databaseUsers: string[] = [];
  public portsInUse: string[] = [];
  public tagsInUse: string[] = [];

  // Result lists
  public applicationDependencies: ApplicationDependency[] = [];
  public deploymentDatabases: DeploymentDatabase[] = [];
  public portDeployments: Deployment[] = [];
  public tagApplications: Application[] = [];

  // Suggestion lists
  public dependencySuggestions: Dependency[] = [];
  public databaseUserSuggestions: string[] = [];
  public portSuggestions: string[] = [];
  public tagSuggestions: string[] = [];

  public selectedTab = 0;
  public tabNames = ['Dependency Search', 'DB User Search', 'Port Search', 'Tag Search'];
  public selectedDependencyReference = '';
  public selectedDatabaseUser = '';
  public selectedPort = '';
  public selectedTag = '';

  public dependencySearchColumns = [
    {field: 'application.name', header: 'Application Name', width: '200px'},
    {field: 'dependency.managerReference', header: 'Dependency Reference', width: '200px'}
  ];

  public dbUserColumns = [
    {header: 'Application Deployment', colspan: '3', width: '400px'},
    {header: 'Database', colspan: '3', width: '250px'}
  ];

  public dbUserSubColumns = [
    {field: 'deployment.contextName', header: 'Context Name', width: '150px'},
    {field: 'deployment.environment', header: 'Environment', width: '50px'},
    {field: 'deployment.hostServerId', header: 'Host Server', width: '200px'},
    {field: 'database.name', header: 'Name', width: '100px'},
    {field: 'database.environment', header: 'Environment', width: '50px'},
    {field: 'connectionUsername', header: 'Username', width: '100px'}
  ];

  public portSearchColumns = [
    {field: 'contextName', header: 'Application Context Name', width: '250px'},
    {field: 'environment', header: 'Environment', width: '100px'},
    {field: 'hostServerId', header: 'Host Server', width: '250px'},
    {field: 'port', header: 'Port', width: '100px'}
  ];

  public tagSearchColumns = [
    {field: 'name', header: 'Application Name', width: '200px'},
    {field: 'tags', header: 'Tags', width: '300px'},
  ];

  public FIND_AVAILABLE_PORT_MODAL_ID = 'find-available-port-modal';

  @ViewChild('findAvailablePortComponent')
  public findAvailablePortComponent: FindAvailablePortComponent;

  constructor(private applicationService: ApplicationService, private applicationDependencyService: ApplicationDependencyService,
              private dependencyService: DependencyService, private deploymentService: DeploymentService,
              private deploymentDatabaseService: DeploymentDatabaseService, private hostServerService: HostServerService,
              private modalService: ModalService, private shareDataService: ShareDataService) {
  }

  ngOnInit() {
    this.loadApplications();
    this.loadDependencies();
    this.loadDeployments();
    this.loadDatabaseUsers();
    this.loadHostServers();
  }

  public loadApplications = () => {
    this.applicationService.findAll()
      .subscribe(response => {
        this.applications = response.data;
        this.loadTagsInUse();
      });
  }

  public loadDependencies = () => {
    this.dependencyService.findAll()
      .subscribe(response => {
        this.dependencies = response.data;
      });
  }

  public loadDeployments = () => {
    this.deploymentService.findAll()
      .subscribe(response => {
        this.deployments = response.data;
        this.loadPortsInUse();
      });
  }

  public loadDatabaseUsers = () => {
    this.deploymentDatabaseService.findAll()
      .subscribe(response => {
        const deploymentDatabases: DeploymentDatabase[] = response.data;

        for (const depDb of deploymentDatabases) {
          let existsInList = false;

          for (const dbUser of this.databaseUsers) {
            if (depDb.connectionUsername === dbUser) {
              existsInList = true;
              break;
            }
          }

          if (!existsInList) {
            this.databaseUsers.push(depDb.connectionUsername);
          }
        }
      });
  }

  public loadHostServers = () => {
    this.hostServerService.findAll()
      .subscribe(response => {
        this.hostServers = response.data;
      });
  }

  public loadPortsInUse = () => {
    for (const deployment of this.deployments) {
      let existsInList = false;

      for (const port of this.portsInUse) {
        if (deployment.port === port) {
          existsInList = true;
          break;
        }
      }

      if (deployment.port && !existsInList) {
        this.portsInUse.push(deployment.port);
      }
    }
  }

  public loadTagsInUse = () => {
    for (const application of this.applications) {
      for (const appTag of application.tags) {

        let existsInList = false;

        for (const tag of this.tagsInUse) {
          if (appTag === tag) {
            existsInList = true;
            break;
          }
        }

        if (appTag && !existsInList) {
          this.tagsInUse.push(appTag);
        }
      }
    }
}

  public openModal(modalId: string): void {
    this.modalService.openModal(modalId);
  }

  public closeModal(modalId: string): void {
    this.modalService.closeModal(modalId);
  }

  /**
   * Switch tabs. Also, clear all searches when switching.
   *
   * @param tab
   */
  public toggleTabs(tab: number): void {
    this.applicationDependencies = [];
    this.deploymentDatabases = [];
    this.portDeployments = [];
    this.tagApplications = [];
    this.selectedTab = tab;
  }

  public getHostServerName(hostServerId: string): string {
    if (!this.hostServers || !hostServerId) {
      return '';
    }
    for (const hostServer of this.hostServers) {
      if (hostServer.id == hostServerId) {
        return hostServer.name;
      }
    }
    return null;
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

  public findDeploymentDatabasesByDatabaseUser() {
    if (!this.selectedDatabaseUser) {
      return;
    }

    const params = [{name: 'connectionUsername', value: this.selectedDatabaseUser}];
    this.shareDataService.blockUI(true);

    this.deploymentDatabaseService.filterAll(params)
      .subscribe(response => {
        this.deploymentDatabases = response.data;
        this.shareDataService.blockUI(false);
      });
  }

  public findDeploymentsByPort() {
    if (!this.selectedPort) {
      return;
    }

    const params = [{name: 'port', value: this.selectedPort}];
    this.shareDataService.blockUI(true);

    this.deploymentService.filterAll(params)
      .subscribe(response => {
        this.portDeployments = response.data;
        this.shareDataService.blockUI(false);
      });
  }

  public findApplicationsByTag() {
    if (!this.selectedTag) {
      return;
    }

    const params = [{name: 'tag', value: this.selectedTag}];
    this.shareDataService.blockUI(true);

    this.applicationService.filterAll(params)
      .subscribe(response => {
        this.tagApplications = response.data;
        this.shareDataService.blockUI(false);
      });
  }

  public processDependencyTypeAhead(): void {
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

  public processDatabaseUserTypeAhead(): void {
    const results: string[] = [];

    if (!this.selectedDatabaseUser) {
      return;
    }

    for (const dbUser of this.databaseUsers) {
      if (results.length < this.TYPE_AHEAD_SIZE) {
        const check1 = dbUser.toLowerCase();
        const check2 = this.selectedDatabaseUser.toLowerCase();

        if (check1.indexOf(check2) >= 0) {
          results.push(dbUser);
        }
      } else {
        break;
      }

      this.databaseUserSuggestions = results;
    }
  }

  public processPortTypeAhead(): void {
    const results: string[] = [];

    if (!this.selectedPort) {
      return;
    }

    for (const port of this.portsInUse) {
      if (results.length < this.TYPE_AHEAD_SIZE) {
        const check1 = port.toLowerCase();
        const check2 = this.selectedPort.toLowerCase();

        if (check1.indexOf(check2) >= 0) {
          results.push(port);
        }
      } else {
        break;
      }

      this.portSuggestions = results;
    }
  }

  public processTagTypeAhead(): void {
    const results: string[] = [];

    if (!this.selectedTag) {
      return;
    }

    for (const tag of this.tagsInUse) {
      if (results.length < this.TYPE_AHEAD_SIZE) {
        const check1 = tag.toLowerCase();
        const check2 = this.selectedTag.toLowerCase();

        if (check1.indexOf(check2) >= 0) {
          results.push(tag);
        }
      } else {
        break;
      }

      this.tagSuggestions = results;
    }
  }

  public selectDependencySuggestion(suggestion: Dependency) {
    this.selectedDependencyReference = suggestion.managerReference;
    this.performDependencySearch();
  }

  public selectDatabaseUserSuggestion(suggestion: string) {
    this.selectedDatabaseUser = suggestion;
    this.performDatabaseUserSearch();
  }

  public selectPortSuggestion(suggestion: string) {
    this.selectedPort = suggestion;
    this.performPortSearch();
  }

  public selectTagSuggestion(suggestion: string) {
    this.selectedTag = suggestion;
    this.performTagSearch();
  }

  public performDependencySearch(): void {
    this.findApplicationDependenciesByReference();
    this.selectedDependencyReference = '';
    this.dependencySuggestions = [];
  }

  public performDatabaseUserSearch(): void {
    this.findDeploymentDatabasesByDatabaseUser();
    this.selectedDatabaseUser = '';
    this.databaseUserSuggestions = [];
  }

  public performPortSearch(): void {
    this.findDeploymentsByPort();
    this.selectedPort = '';
    this.portSuggestions = [];
  }

  public performTagSearch(): void {
    this.findApplicationsByTag();
    this.selectedTag = '';
    this.tagSuggestions = [];
  }

  public resetFindAvailablePortComponent(): void {
    this.findAvailablePortComponent.setDefaultValues();
  }
}
