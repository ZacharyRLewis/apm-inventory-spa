import {Component, OnInit, ViewChild} from '@angular/core';
import {Database, DatabaseType} from '../../model';
import {DatabaseTypeService} from '../../services/database-type/database-type.service';
import {DatabaseService, ModalService} from '../../services';
import {DatabaseComponent} from './database.component';

@Component({
  selector: 'apm-database-list',
  templateUrl: './database-list.component.html',
  styleUrls: ['./database-list.component.scss']
})
export class DatabaseListComponent implements OnInit  {

  public databases: Database[] = [];
  public databaseTypes: DatabaseType[] = [];

  @ViewChild('databaseComponent')
  databaseComponent: DatabaseComponent;

  constructor(private databaseService: DatabaseService, private databaseTypeService: DatabaseTypeService, private modalService: ModalService) {
    this.refreshDatabases();
  }

  ngOnInit() {
    this.loadDatabaseTypes();
  }

  public refreshDatabases(): void {
    this.databaseService.findAll()
      .subscribe(response => {
        this.databases = response.data;
      });
  }

  public resetDatabaseComponent(): void {
    this.databaseComponent.passedDatabase = null;
    this.databaseComponent.setDefaultValues();
  }

  public setPassedDatabase(database: Database): void {
    this.databaseComponent.passedDatabase = Object.assign({}, database);
    this.databaseComponent.model = Object.assign({}, database);
  }

  public openModal(): void {
    this.databaseComponent.databaseTypes = this.databaseTypes;
    this.modalService.open('database-component');
  }

  public handleCreate(database: Database): void {
    console.log('Database ' + database.name + ' successfully created');
    this.refreshDatabases();
  }

  public handleDelete(database: Database): void {
    console.log('Database ' + database.name + ' successfully deleted');
    this.refreshDatabases();
  }

  public handleUpdate(database: Database): void {
    console.log('Database ' + database.name + ' successfully updated');
    this.refreshDatabases();
  }

  loadDatabaseTypes = () => {
    this.databaseTypeService.findAll()
      .subscribe(response => {
        this.databaseTypes = response.data;
      });
  }
}
