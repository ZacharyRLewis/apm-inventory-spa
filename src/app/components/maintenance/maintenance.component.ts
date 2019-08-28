import {Component, ViewChild} from '@angular/core';
import {ModalService, ShareDataService} from '@win-angular/services';
import {ApplicationType, Database, DatabaseType, HostServer, Permissions} from '../../model';
import {ApplicationTypeService, DatabaseService, DatabaseTypeService, HostServerService, PermissionsService} from '../../services';
import {DatabaseComponent} from './database.component';
import {ApplicationTypeComponent} from './application-type.component';
import {DatabaseTypeComponent} from './database-type.component';
import {HostServerComponent} from './host-server.component';

@Component({
  selector: 'apm-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent {

  public selectedTab = 0;
  public tabNames = ['Application Types', 'Database Types', 'Databases', 'Host Servers'];

  public applicationTypes: ApplicationType[] = [];
  public databaseTypes: DatabaseType[] = [];
  public databases: Database[] = [];
  public hostServers: HostServer[] = [];
  public permissions: Permissions;

  public readonly APPLICATION_TYPE_MODAL_ID = 'application-type-modal';
  public readonly DATABASE_TYPE_MODAL_ID = 'database-type-modal';
  public readonly DATABASE_MODAL_ID = 'database-modal';
  public readonly HOST_SERVER_MODAL_ID = 'host-server-modal';

  public applicationTypeColumns = [
    {field: 'id', header: 'Id', width: '50px'},
    {field: 'name', header: 'Name', width: '100px'},
    {field: 'version', header: 'Version', width: '100px'},
    {field: 'description', header: 'Description', width: '150px'}
  ];

  public databaseTypeColumns = [
    {field: 'id', header: 'Id', width: '50px'},
    {field: 'name', header: 'Name', width: '200px'}
  ];

  public databaseColumns = [
    {field: 'id', header: 'Id', width: '30px'},
    {field: 'environment', header: 'Environment', width: '60px'},
    {field: 'hostName', header: 'Host Name', width: '100px'},
    {field: 'name', header: 'Name', width: '100px'},
    {field: 'port', header: 'Port', width: '30px'},
    {field: 'type.name', header: 'Type', width: '80px'}
  ];

  public hostServerColumns = [
    {field: 'id', header: 'Id', width: '30px'},
    {field: 'name', header: 'Name', width: '100px'},
    {field: 'operatingSystem', header: 'Operating System', width: '60px'},
    {field: 'environment', header: 'Environment', width: '60px'}
  ];

  @ViewChild('applicationTypeComponent')
  applicationTypeComponent: ApplicationTypeComponent;

  @ViewChild('databaseTypeComponent')
  databaseTypeComponent: DatabaseTypeComponent;

  @ViewChild('databaseComponent')
  databaseComponent: DatabaseComponent;

  @ViewChild('hostServerComponent')
  hostServerComponent: HostServerComponent;

  constructor(private applicationTypeService: ApplicationTypeService, private databaseTypeService: DatabaseTypeService,
              private databaseService: DatabaseService, private hostServerService: HostServerService,
              private modalService: ModalService, private shareDataService: ShareDataService, private permissionsService: PermissionsService) {
    this.refreshApplicationTypes();
    this.refreshDatabaseTypes();
    this.refreshDatabases();
    this.refreshHostServers();

    this.permissionsService.findUserPermissions()
      .subscribe(response => {
        this.permissions = response.data;
      });
  }

  public toggleTabs(tab: number): void {
    this.selectedTab = tab;
  }

  public refreshApplicationTypes(): void {
    this.applicationTypeService.findAll()
      .subscribe(response => {
        this.applicationTypes = response.data;
      });
  }

  public refreshDatabaseTypes(): void {
    this.databaseTypeService.findAll()
      .subscribe(response => {
        this.databaseTypes = response.data;
      });
  }

  public refreshDatabases(): void {
    this.databaseService.findAll()
      .subscribe(response => {
        this.databases = response.data;
      });
  }

  public refreshHostServers(): void {
    this.hostServerService.findAll()
      .subscribe(response => {
        this.hostServers = response.data;
      });
  }

  public resetApplicationTypeComponent(): void {
    this.applicationTypeComponent.passedApplicationType = null;
    this.applicationTypeComponent.setDefaultValues();
  }

  public resetDatabaseTypeComponent(): void {
    this.databaseTypeComponent.passedDatabaseType = null;
    this.databaseTypeComponent.setDefaultValues();
  }

  public resetDatabaseComponent(): void {
    this.databaseComponent.passedDatabase = null;
    this.databaseComponent.setDefaultValues();
  }

  public resetHostServerComponent(): void {
    this.hostServerComponent.passedHostServer = null;
    this.hostServerComponent.setDefaultValues();
  }

  public prepareApplicationTypeModal(applicationType: ApplicationType): void {
    this.applicationTypeComponent.passedApplicationType = Object.assign({}, applicationType);
    this.applicationTypeComponent.model = Object.assign({}, applicationType);
    this.applicationTypeComponent.loadApplicationUses();
  }

  public prepareDatabaseTypeModal(databaseType: DatabaseType): void {
    this.databaseTypeComponent.passedDatabaseType = Object.assign({}, databaseType);
    this.databaseTypeComponent.model = Object.assign({}, databaseType);
    this.databaseTypeComponent.loadDatabaseUses();
  }

  public prepareDatabaseModal(database: Database): void {
    this.databaseComponent.passedDatabase = Object.assign({}, database);
    this.databaseComponent.model = Object.assign({}, database);
    this.databaseComponent.loadDeploymentUses();
  }

  public prepareHostServerModal(hostServer: HostServer): void {
    this.hostServerComponent.passedHostServer = Object.assign({}, hostServer);
    this.hostServerComponent.model = Object.assign({}, hostServer);
    this.hostServerComponent.loadDeploymentUses();
  }

  public openApplicationTypeModal(): void {
    history.pushState(null, null, document.URL);
    this.modalService.openModal(this.APPLICATION_TYPE_MODAL_ID);
    this.modalService.registerPopState(this.applicationTypeComponent.backButtonCallback);
  }

  public openDatabaseModal(): void {
    history.pushState(null, null, document.URL);
    this.modalService.openModal(this.DATABASE_MODAL_ID);
    this.modalService.registerPopState(this.databaseComponent.backButtonCallback);
  }

  public openDatabaseTypeModal(): void {
    history.pushState(null, null, document.URL);
    this.modalService.openModal(this.DATABASE_TYPE_MODAL_ID);
    this.modalService.registerPopState(this.databaseTypeComponent.backButtonCallback);
  }

  public openHostServerModal(): void {
    history.pushState(null, null, document.URL);
    this.modalService.openModal(this.HOST_SERVER_MODAL_ID);
    this.modalService.registerPopState(this.hostServerComponent.backButtonCallback);
  }

  public closeApplicationTypeModal(): void {
    this.modalService.unregisterPopState(this.applicationTypeComponent.backButtonCallback);
    this.modalService.closeModal(this.APPLICATION_TYPE_MODAL_ID);
  }

  public closeDatabaseModal(): void {
    this.modalService.unregisterPopState(this.databaseComponent.backButtonCallback);
    this.modalService.closeModal(this.DATABASE_MODAL_ID);
  }

  public closeDatabaseTypeModal(): void {
    this.modalService.unregisterPopState(this.databaseTypeComponent.backButtonCallback);
    this.modalService.closeModal(this.DATABASE_TYPE_MODAL_ID);
  }

  public closeHostServerModal(): void {
    this.modalService.unregisterPopState(this.hostServerComponent.backButtonCallback);
    this.modalService.closeModal(this.HOST_SERVER_MODAL_ID);
  }

  public handleApplicationTypeCreate(applicationType: ApplicationType): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Application Type ' + applicationType.name + ' successfully created'}]);
    this.refreshApplicationTypes();
  }

  public handleApplicationTypeDelete(applicationType: ApplicationType): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Application Type ' + applicationType.name + ' successfully deleted'}]);
    this.refreshApplicationTypes();
  }

  public handleApplicationTypeUpdate(applicationType: ApplicationType): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Application Type ' + applicationType.name + ' successfully updated'}]);
    this.refreshApplicationTypes();
  }

  public handleDatabaseTypeCreate(databaseType: DatabaseType): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Database Type ' + databaseType.name + ' successfully created'}]);
    this.refreshDatabaseTypes();
  }

  public handleDatabaseTypeDelete(databaseType: DatabaseType): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Database Type ' + databaseType.name + ' successfully deleted'}]);
    this.refreshDatabaseTypes();
  }

  public handleDatabaseTypeUpdate(databaseType: DatabaseType): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Database Type ' + databaseType.name + ' successfully updated'}]);
    this.refreshDatabaseTypes();
  }

  public handleDatabaseCreate(database: Database): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Database ' + database.name + ' successfully created'}]);
    this.refreshDatabases();
  }

  public handleDatabaseDelete(database: Database): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Database ' + database.name + ' successfully deleted'}]);
    this.refreshDatabases();
  }

  public handleDatabaseUpdate(database: Database): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Database ' + database.name + ' successfully updated'}]);
    this.refreshDatabases();
  }

  public handleHostServerCreate(hostServer: HostServer): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Host Server ' + hostServer.name + ' successfully created'}]);
    this.refreshHostServers();
  }

  public handleHostServerDelete(hostServer: HostServer): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Host Server ' + hostServer.name + ' successfully deleted'}]);
    this.refreshHostServers();
  }

  public handleHostServerUpdate(hostServer: HostServer): void {
    this.shareDataService.showStatus([{severity: 'success', summary: 'Host Server ' + hostServer.name + ' successfully updated'}]);
    this.refreshHostServers();
  }

  public getDatabaseTypeName(databaseTypeId: string): string {
    if (!this.databaseTypes || !databaseTypeId) {
      return '';
    }
    for (const databaseType of this.databaseTypes) {
      if (databaseType.id === databaseTypeId) {
        return databaseType.name;
      }
    }
    return null;
  }
}
