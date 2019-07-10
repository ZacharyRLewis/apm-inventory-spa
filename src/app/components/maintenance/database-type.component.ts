import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ModalService, ShareDataService} from '@win-angular/services';
import {DatabaseType, Permissions} from '../../model';
import {DatabaseService, DatabaseTypeService} from '../../services';

@Component({
  selector: 'apm-database-type',
  templateUrl: './database-type.component.html',
  styleUrls: ['./database-type.component.scss']
})
export class DatabaseTypeComponent {

  @Input() modalId: string;
  @Input() permissions: Permissions;
  @Output() createEvent: EventEmitter<DatabaseType> = new EventEmitter<DatabaseType>();
  @Output() deleteEvent: EventEmitter<DatabaseType> = new EventEmitter<DatabaseType>();
  @Output() updateEvent: EventEmitter<DatabaseType> = new EventEmitter<DatabaseType>();

  public model: DatabaseType = new DatabaseType();
  public passedDatabaseType: DatabaseType;
  public databaseUses = 0;

  @ViewChild('newDatabaseTypeForm')
  public newDatabaseTypeForm;

  constructor(private databaseService: DatabaseService, private databaseTypeService: DatabaseTypeService,
              private modalService: ModalService, private shareDataService: ShareDataService) {
    this.setDefaultValues();
  }

  public setDefaultValues(): void {
    this.model.id = null;
    this.model.name = '';
  }

  public loadDatabaseUses = () => {
    const params = [{name: 'databaseTypeId', value: this.passedDatabaseType.id}];
    console.log('databases params = ' + JSON.stringify(params));

    this.databaseService.filterAll(params)
      .subscribe(response => {
        console.log('databases response: ' + JSON.stringify(response));
        this.databaseUses = response.data.length;
      });
  }

  public closeModal(): void {
    this.modalService.closeModal(this.modalId);
    this.newDatabaseTypeForm.resetForm();
  }

  public hasAdminPermissions(): boolean {
    return this.permissions.permissions.indexOf('APM_Admin') >= 0;
  }

  public saveDatabaseType(): void {
    if (this.passedDatabaseType) {
      this.updateDatabaseType();
    } else {
      this.createDatabaseType();
    }
  }

  public createDatabaseType(): void {
    const created: DatabaseType = Object.assign({}, this.model);

    if (!this.hasAdminPermissions()) {
      this.shareDataService.showStatus([{severity: 'error', summary: 'You are not authorized to create a database type'}]);
      return;
    }

    this.databaseTypeService.create(created)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.createEvent.emit(created);
        },
        err => {
          this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(create databaseType) >> ' + err.message}]);
        });
  }

  public updateDatabaseType(): void {
    const updated: DatabaseType = Object.assign({}, this.model);

    if (!this.hasAdminPermissions()) {
      this.shareDataService.showStatus([{severity: 'error', summary: 'You are not authorized to update a database type'}]);
      return;
    }

    this.databaseTypeService.update(updated)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.updateEvent.emit(updated);
        },
        err => {
          this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(update databaseType) >> ' + err.message}]);
        });
  }

  public deleteDatabaseType(): void {
    const deleted: DatabaseType = Object.assign({}, this.model);

    if (!this.hasAdminPermissions()) {
      this.shareDataService.showStatus([{severity: 'error', summary: 'You are not authorized to delete a database type'}]);
      return;
    }

    if (this.databaseUses > 0) {
      this.shareDataService.showStatus([{severity: 'error', summary: 'This database type cannot be deleted because it is in use'}]);
      return;
    }

    this.databaseTypeService.delete(deleted)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.deleteEvent.emit(deleted);
        },
        err => {
          this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(delete databaseType) >> ' + err.message}]);
        });
  }
}
