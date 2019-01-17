import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModalService} from '@win-angular/services';
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

  model: ApplicationType = new ApplicationType();
  passedApplicationType: ApplicationType;

  constructor(private applicationTypeService: ApplicationTypeService, private modalService: ModalService) {
    this.setDefaultValues();
  }

  public setDefaultValues(): void {
    this.model.id = null;
    this.model.name = '';
    this.model.version = '';
  }

  public closeModal(): void {
    this.modalService.closeModal(this.modalId);
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
          console.log('ERR:(create applicationType) >> ' + err.message);
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
          console.log('ERR:(update applicationType) >> ' + err.message);
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
          console.log('ERR:(delete applicationType) >> ' + err.message);
        });
  }
}
