import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Application, ApplicationType} from '../../model';
import {ApplicationService, ModalService} from '../../services';

@Component({
  selector: 'apm-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent {

  @Input() modalId: string;
  @Output() createEvent: EventEmitter<Application> = new EventEmitter<Application>();
  @Output() deleteEvent: EventEmitter<Application> = new EventEmitter<Application>();
  @Output() updateEvent: EventEmitter<Application> = new EventEmitter<Application>();

  model: Application = new Application();
  passedApplication: Application;

  constructor(private applicationService: ApplicationService, private modalService: ModalService) {
    this.setDefaultValues();
  }

  public setDefaultValues(): void {
    this.model.id = null;
    this.model.name = '';
    this.model.mnemonic = '';
    this.model.description = '';
    this.model.applicationType = new ApplicationType();
    this.model.applicationType.name = '';
    this.model.computeEnvironments = [];
    this.model.dependencies = [];
  }

  public closeModal(): void {
    this.modalService.close(this.modalId);
  }

  public saveApplication(): void {
    if (this.passedApplication) {
      this.updateApplication();
    } else {
      this.createApplication();
    }
  }

  public createApplication(): void {
    const created: Application = Object.assign({}, this.model);

    console.log('Attempting to create application: ' + JSON.stringify(created));

    this.applicationService.create(created)
      .subscribe(res => {
          console.log('Create application response: ' + JSON.stringify(res));
          this.closeModal();
          this.setDefaultValues();
          this.createEvent.emit(created);
        },
        err => {
          console.log('ERR:(create application) >> ' + err.message);
        });
  }

  public updateApplication(): void {
    const updated: Application = Object.assign({}, this.model);

    console.log('Attempting to update application: ' + JSON.stringify(updated));

    this.applicationService.update(updated)
      .subscribe(res => {
          console.log('Update application response: ' + JSON.stringify(res));
          this.closeModal();
          this.setDefaultValues();
          this.updateEvent.emit(updated);
        },
        err => {
          console.log('ERR:(update application) >> ' + err.message);
        });
  }

  public deleteApplication(): void {
    const deleted: Application = Object.assign({}, this.model);

    console.log('Attempting to delete application: ' + JSON.stringify(deleted));

    this.applicationService.delete(deleted)
      .subscribe(res => {
          console.log('Delete application response: ' + JSON.stringify(res));
          this.closeModal();
          this.setDefaultValues();
          this.deleteEvent.emit(deleted);
        },
        err => {
          console.log('ERR:(delete application) >> ' + err.message);
        });
  }
}
