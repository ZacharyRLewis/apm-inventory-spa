import {Component, OnInit, ViewChild} from '@angular/core';
import {Application, ApplicationType} from '../../model/index';
import {ApplicationTypeService} from '../../services/application-type/application-type.service';
import {ApplicationService} from '../../services/application/application.service';
import {ModalService} from '../../services';
import {ApplicationComponent} from '../application/application.component';

@Component({
  selector: 'apm-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit  {

  public applications: Application[] = [];
  public applicationTypes: ApplicationType[] = [];
  public databaseTypes: ApplicationType[] = [];

  @ViewChild('applicationComponent')
  applicationComponent: ApplicationComponent;

  constructor(private applicationService: ApplicationService, private applicationTypeService: ApplicationTypeService,
              private modalService: ModalService) {
    this.refreshApplications();
  }

  ngOnInit() {
    this.loadApplicationTypes();
  }

  public refreshApplications(): void {
    this.applicationService.findAll()
      .subscribe(response => {
        this.applications = response.data;
      });
  }

  public resetApplicationComponent(): void {
    this.applicationComponent.passedApplication = null;
    this.applicationComponent.setDefaultValues();
  }

  public setPassedApplication(application: Application): void {
    this.applicationComponent.passedApplication = Object.assign({}, application);
    this.applicationComponent.model = Object.assign({}, application);
  }

  public openModal(): void {
    this.applicationComponent.applicationTypes = this.applicationTypes;
    this.modalService.open('application-component');
  }

  public handleCreate(application: Application): void {
    console.log('Application ' + application.mnemonic + ' successfully created');
    this.refreshApplications();
  }

  public handleDelete(application: Application): void {
    console.log('Application ' + application.mnemonic + ' successfully deleted');
    this.refreshApplications();
  }

  public handleUpdate(application: Application): void {
    console.log('Application ' + application.mnemonic + ' successfully updated');
    this.refreshApplications();
  }

  loadApplicationTypes = () => {
    this.applicationTypeService.findAll()
      .subscribe(response => {
        this.applicationTypes = response.data;
      });
  }
}
