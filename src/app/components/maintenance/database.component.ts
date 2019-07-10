import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ModalService, ShareDataService} from '@win-angular/services';
import {Database, DatabaseType, Permissions} from '../../model';
import {DatabaseService} from '../../services';

@Component({
  selector: 'apm-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent {

  @Input() modalId: string;
  @Input() databaseTypes: DatabaseType[] = [];
  @Input() permissions: Permissions;
  @Output() createEvent: EventEmitter<Database> = new EventEmitter<Database>();
  @Output() deleteEvent: EventEmitter<Database> = new EventEmitter<Database>();
  @Output() updateEvent: EventEmitter<Database> = new EventEmitter<Database>();

  public model: Database = new Database();
  public passedDatabase: Database;
  public environments: string[] = ['DEV', 'QA', 'PROD'];

  @ViewChild('newDatabaseForm')
  public newDatabaseForm;

  constructor(private databaseService: DatabaseService, private modalService: ModalService, private shareDataService: ShareDataService) {
    this.setDefaultValues();
  }

  public setDefaultValues(): void {
    this.model.id = null;
    this.model.name = '';
    this.model.hostName = '';
    this.model.port = '';
    this.model.type = new DatabaseType();
    this.model.type.name = '';
    this.model.environment = '';
  }

  public closeModal(): void {
    this.modalService.closeModal(this.modalId);
    this.newDatabaseForm.resetForm();
  }

  public hasAdminPermissions(): boolean {
    return this.permissions.permissions.indexOf('APM_Admin') >= 0;
  }

  public saveDatabase(): void {
    if (this.passedDatabase) {
      this.updateDatabase();
    } else {
      this.createDatabase();
    }
  }

  public createDatabase(): void {
    const created: Database = Object.assign({}, this.model);

    if (!this.hasAdminPermissions()) {
      this.shareDataService.showStatus([{severity: 'error', summary: 'You are not authorized to create a database'}]);
      return;
    }

    this.databaseService.create(created)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.createEvent.emit(created);
        },
        err => {
          this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(create database) >> ' + err.message}]);
        });
  }

  public updateDatabase(): void {
    const updated: Database = Object.assign({}, this.model);

    if (!this.hasAdminPermissions()) {
      this.shareDataService.showStatus([{severity: 'error', summary: 'You are not authorized to update a database'}]);
      return;
    }

    this.databaseService.update(updated)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.updateEvent.emit(updated);
        },
        err => {
          this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(update database) >> ' + err.message}]);
        });
  }

  public deleteDatabase(): void {
    const deleted: Database = Object.assign({}, this.model);

    if (!this.hasAdminPermissions()) {
      this.shareDataService.showStatus([{severity: 'error', summary: 'You are not authorized to delete a database'}]);
      return;
    }

    this.databaseService.delete(deleted)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.deleteEvent.emit(deleted);
        },
        err => {
          this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(delete database) >> ' + err.message}]);
        });
  }
}
