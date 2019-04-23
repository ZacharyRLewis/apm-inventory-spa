import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModalService} from '@win-angular/services';
import {Database, DatabaseType} from '../../model';
import {DatabaseService} from '../../services';

@Component({
  selector: 'apm-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent {

  @Input() modalId: string;
  @Input() databaseTypes: DatabaseType[] = [];
  @Output() createEvent: EventEmitter<Database> = new EventEmitter<Database>();
  @Output() deleteEvent: EventEmitter<Database> = new EventEmitter<Database>();
  @Output() updateEvent: EventEmitter<Database> = new EventEmitter<Database>();

  model: Database = new Database();
  passedDatabase: Database;
  environments: string[] = ['DEV', 'QA', 'PROD'];

  constructor(private databaseService: DatabaseService, private modalService: ModalService) {
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

    this.databaseService.create(created)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.createEvent.emit(created);
        },
        err => {
          console.log('ERR:(create database) >> ' + err.message);
        });
  }

  public updateDatabase(): void {
    const updated: Database = Object.assign({}, this.model);

    this.databaseService.update(updated)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.updateEvent.emit(updated);
        },
        err => {
          console.log('ERR:(update database) >> ' + err.message);
        });
  }

  public deleteDatabase(): void {
    const deleted: Database = Object.assign({}, this.model);

    this.databaseService.delete(deleted)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.deleteEvent.emit(deleted);
        },
        err => {
          console.log('ERR:(delete database) >> ' + err.message);
        });
  }
}
