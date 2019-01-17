import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalService} from '@win-angular/services';
import {ApplicationType, DatabaseType} from '../../model';
import {ApplicationTypeService, DatabaseTypeService} from '../../services';
import {ApplicationTypeComponent} from './application-type.component';
import {DatabaseTypeComponent} from './database-type.component';

@Component({
  selector: 'apm-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: ['./type-list.component.scss']
})
export class TypeListComponent implements OnInit {

  public applicationTypes: ApplicationType[] = [];
  public databaseTypes: DatabaseType[] = [];

  public APPLICATION_TYPE_MODAL_ID = 'application-type-modal';
  public DATABASE_TYPE_MODAL_ID = 'database-type-modal';

  @ViewChild('applicationTypeComponent')
  applicationTypeComponent: ApplicationTypeComponent;

  @ViewChild('databaseTypeComponent')
  databaseTypeComponent: DatabaseTypeComponent;

  constructor(private applicationTypeService: ApplicationTypeService, private databaseTypeService: DatabaseTypeService,
              private modalService: ModalService) {
    this.refreshApplicationTypes();
    this.refreshDatabaseTypes();
  }

  ngOnInit() {
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

  public resetApplicationTypeComponent(): void {
    this.applicationTypeComponent.passedApplicationType = null;
    this.applicationTypeComponent.setDefaultValues();
  }

  public resetDatabaseTypeComponent(): void {
    this.databaseTypeComponent.passedDatabaseType = null;
    this.databaseTypeComponent.setDefaultValues();
  }

  public setPassedApplicationType(applicationType: ApplicationType): void {
    this.applicationTypeComponent.passedApplicationType = Object.assign({}, applicationType);
    this.applicationTypeComponent.model = Object.assign({}, applicationType);
  }

  public setPassedDatabaseType(databaseType: DatabaseType): void {
    this.databaseTypeComponent.passedDatabaseType = Object.assign({}, databaseType);
    this.databaseTypeComponent.model = Object.assign({}, databaseType);
  }

  public openModal(modalId: string): void {
    this.modalService.openModal(modalId);
  }

  public closeModal(modalId: string): void {
    this.modalService.closeModal(modalId);
  }

  public handleApplicationTypeCreate(applicationType: ApplicationType): void {
    console.log('Application Type ' + applicationType.name + ' successfully created');
    this.refreshApplicationTypes();
  }

  public handleApplicationTypeDelete(applicationType: ApplicationType): void {
    console.log('Application Type ' + applicationType.name + ' successfully deleted');
    this.refreshApplicationTypes();
  }

  public handleApplicationTypeUpdate(applicationType: ApplicationType): void {
    console.log('Application Type ' + applicationType.name + ' successfully updated');
    this.refreshApplicationTypes();
  }

  public handleDatabaseTypeCreate(databaseType: DatabaseType): void {
    console.log('Database Type ' + databaseType.name + ' successfully created');
    this.refreshDatabaseTypes();
  }

  public handleDatabaseTypeDelete(databaseType: DatabaseType): void {
    console.log('Database Type ' + databaseType.name + ' successfully deleted');
    this.refreshDatabaseTypes();
  }

  public handleDatabaseTypeUpdate(databaseType: DatabaseType): void {
    console.log('Database Type ' + databaseType.name + ' successfully updated');
    this.refreshDatabaseTypes();
  }
}
