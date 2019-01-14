import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DatabaseType} from '../../model';
import {DatabaseTypeService, ModalService} from '../../services';

@Component({
  selector: 'apm-database-type',
  templateUrl: './database-type.component.html',
  styleUrls: ['./database-type.component.scss']
})
export class DatabaseTypeComponent {

  @Input() modalId: string;
  @Output() createEvent: EventEmitter<DatabaseType> = new EventEmitter<DatabaseType>();
  @Output() deleteEvent: EventEmitter<DatabaseType> = new EventEmitter<DatabaseType>();
  @Output() updateEvent: EventEmitter<DatabaseType> = new EventEmitter<DatabaseType>();

  model: DatabaseType = new DatabaseType();
  passedDatabaseType: DatabaseType;

  constructor(private databaseTypeService: DatabaseTypeService, private modalService: ModalService) {
    this.setDefaultValues();
  }

  public setDefaultValues(): void {
    this.model.id = null;
    this.model.name = '';
  }

  public closeModal(): void {
    this.modalService.close(this.modalId);
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

    this.databaseTypeService.create(created)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.createEvent.emit(created);
        },
        err => {
          console.log('ERR:(create databaseType) >> ' + err.message);
        });
  }

  public updateDatabaseType(): void {
    const updated: DatabaseType = Object.assign({}, this.model);

    this.databaseTypeService.update(updated)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.updateEvent.emit(updated);
        },
        err => {
          console.log('ERR:(update databaseType) >> ' + err.message);
        });
  }

  public deleteDatabaseType(): void {
    const deleted: DatabaseType = Object.assign({}, this.model);

    this.databaseTypeService.delete(deleted)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.deleteEvent.emit(deleted);
        },
        err => {
          console.log('ERR:(delete databaseType) >> ' + err.message);
        });
  }
}
