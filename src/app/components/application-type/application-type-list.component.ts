import {Component, OnInit, ViewChild} from '@angular/core';
import {ApplicationType} from '../../model';
import {ApplicationTypeService, ModalService} from '../../services';
import {ApplicationTypeComponent} from './application-type.component';

@Component({
  selector: 'apm-application-type-list',
  templateUrl: './application-type-list.component.html',
  styleUrls: ['./application-type-list.component.scss']
})
export class ApplicationTypeListComponent implements OnInit  {

  public applicationTypes: ApplicationType[] = [];

  @ViewChild('applicationTypeComponent')
  applicationTypeComponent: ApplicationTypeComponent;

  constructor(private applicationTypeService: ApplicationTypeService, private modalService: ModalService) {
    this.refreshApplicationTypes();
  }

  ngOnInit() {
  }

  public refreshApplicationTypes(): void {
    this.applicationTypeService.findAll()
      .subscribe(response => {
        this.applicationTypes = response.data;
      });
  }

  public resetApplicationTypeComponent(): void {
    this.applicationTypeComponent.passedApplicationType = null;
    this.applicationTypeComponent.setDefaultValues();
  }

  public setPassedApplicationType(applicationType: ApplicationType): void {
    this.applicationTypeComponent.passedApplicationType = Object.assign({}, applicationType);
    this.applicationTypeComponent.model = Object.assign({}, applicationType);
  }

  public openModal(): void {
    this.modalService.open('application-type-component');
  }

  public handleCreate(applicationType: ApplicationType): void {
    console.log('Application Type ' + applicationType.name + ' successfully created');
    this.refreshApplicationTypes();
  }

  public handleDelete(applicationType: ApplicationType): void {
    console.log('Application Type ' + applicationType.name + ' successfully deleted');
    this.refreshApplicationTypes();
  }

  public handleUpdate(applicationType: ApplicationType): void {
    console.log('Application Type ' + applicationType.name + ' successfully updated');
    this.refreshApplicationTypes();
  }
}
