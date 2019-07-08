import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ModalService, ShareDataService} from '@win-angular/services';
import {ApplicationType} from '../../model';
import {ApplicationTypeService} from '../../services';

@Component({
  selector: 'apm-application-type',
  templateUrl: './application-type.component.html',
  styleUrls: ['./application-type.component.scss']
})
export class ApplicationTypeComponent {

  @Input() modalId: string;
  @Output() createEvent: EventEmitter<ApplicationType> = new EventEmitter<ApplicationType>();
  @Output() deleteEvent: EventEmitter<ApplicationType> = new EventEmitter<ApplicationType>();
  @Output() updateEvent: EventEmitter<ApplicationType> = new EventEmitter<ApplicationType>();

  public model: ApplicationType = new ApplicationType();
  public passedApplicationType: ApplicationType;

  @ViewChild('newApplicationTypeForm')
  public newApplicationTypeForm;

  constructor(private applicationTypeService: ApplicationTypeService, private modalService: ModalService,
              private shareDataService: ShareDataService) {
    this.setDefaultValues();
  }

  public setDefaultValues(): void {
    this.model.id = null;
    this.model.name = '';
    this.model.version = '';
    this.model.description = '';
  }

  public closeModal(): void {
    this.modalService.closeModal(this.modalId);
    this.newApplicationTypeForm.resetForm();
  }

  public saveApplicationType(): void {
    if (this.passedApplicationType) {
      this.updateApplicationType();
    } else {
      this.createApplicationType();
    }
  }

  public createApplicationType(): void {
    const created: ApplicationType = Object.assign({}, this.model);

    this.applicationTypeService.create(created)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.createEvent.emit(created);
        },
        err => {
          this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(create applicationType) >> ' + err.message}]);
        });
  }

  public updateApplicationType(): void {
    const updated: ApplicationType = Object.assign({}, this.model);

    this.applicationTypeService.update(updated)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.updateEvent.emit(updated);
        },
        err => {
          this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(update applicationType) >> ' + err.message}]);
        });
  }

  public deleteApplicationType(): void {
    const deleted: ApplicationType = Object.assign({}, this.model);

    this.applicationTypeService.delete(deleted)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.deleteEvent.emit(deleted);
        },
        err => {
          this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(delete applicationType) >> ' + err.message}]);
        });
  }
}
