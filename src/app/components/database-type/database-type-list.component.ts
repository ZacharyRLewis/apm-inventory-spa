import {Component, OnInit, ViewChild} from '@angular/core';
import {DatabaseType} from '../../model';
import {DatabaseTypeService, ModalService} from '../../services';
import {DatabaseTypeComponent} from './database-type.component';

@Component({
  selector: 'apm-database-type-list',
  templateUrl: './database-type-list.component.html',
  styleUrls: ['./database-type-list.component.scss']
})
export class DatabaseTypeListComponent implements OnInit  {

  public databaseTypes: DatabaseType[] = [];

  @ViewChild('databaseTypeComponent')
  databaseTypeComponent: DatabaseTypeComponent;

  constructor(private databaseTypeService: DatabaseTypeService, private modalService: ModalService) {
    this.refreshDatabaseTypes();
  }

  ngOnInit() {
  }

  public refreshDatabaseTypes(): void {
    this.databaseTypeService.findAll()
      .subscribe(response => {
        this.databaseTypes = response.data;
      });
  }

  public resetDatabaseTypeComponent(): void {
    this.databaseTypeComponent.passedDatabaseType = null;
    this.databaseTypeComponent.setDefaultValues();
  }

  public setPassedDatabaseType(databaseType: DatabaseType): void {
    this.databaseTypeComponent.passedDatabaseType = Object.assign({}, databaseType);
    this.databaseTypeComponent.model = Object.assign({}, databaseType);
  }

  public openModal(): void {
    this.modalService.open('database-type-component');
  }

  public handleCreate(databaseType: DatabaseType): void {
    console.log('Database Type ' + databaseType.name + ' successfully created');
    this.refreshDatabaseTypes();
  }

  public handleDelete(databaseType: DatabaseType): void {
    console.log('Database Type ' + databaseType.name + ' successfully deleted');
    this.refreshDatabaseTypes();
  }

  public handleUpdate(databaseType: DatabaseType): void {
    console.log('Database Type ' + databaseType.name + ' successfully updated');
    this.refreshDatabaseTypes();
  }
}
