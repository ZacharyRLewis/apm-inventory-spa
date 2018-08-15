import {Component, ViewChild} from '@angular/core';
import {Application} from '../../model/index';
import {ApplicationService} from '../../services/application/application.service';
import {ModalService} from '../../services/index';
import {ApplicationComponent} from '../application/application.component';

@Component({
  selector: 'apm-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent {

  public applications: Application[] = [];

  @ViewChild('applicationComponent')
  applicationComponent: ApplicationComponent;

  constructor(private applicationService: ApplicationService, private modalService: ModalService) {
    this.refreshApplications();
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
}
