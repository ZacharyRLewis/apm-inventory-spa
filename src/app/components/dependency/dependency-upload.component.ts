import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ModalService} from '@win-angular/services';
import {FileUpload} from 'primeng/primeng';
import {Application, Database, Deployment} from '../../model';
import {DependencyService} from '../../services';

@Component({
  selector: 'apm-dependency-upload',
  templateUrl: './dependency-upload.component.html',
  styleUrls: ['./dependency-upload.component.scss']
})
export class DependencyUploadComponent {

  @Input() modalId: string;
  @Output() createEvent: EventEmitter<Database> = new EventEmitter<Database>();
  @Output() deleteEvent: EventEmitter<Database> = new EventEmitter<Database>();
  @Output() updateEvent: EventEmitter<Database> = new EventEmitter<Database>();
  @Output() uploadAppDependenciesEvent: EventEmitter<Application> = new EventEmitter<Application>();
  @Output() cancelAppDependenciesEvent: EventEmitter<Application> = new EventEmitter<Application>();

  @ViewChild('fileUpload') fileUpload: FileUpload;

  passedApplication: Application;

  constructor(private dependencyService: DependencyService, private modalService: ModalService) {
    this.setDefaultValues();
  }

  public setDefaultValues(): void {
    this.passedApplication = new Application('');
  }

  public closeModal(): void {
    this.modalService.closeModal(this.modalId);
    this.passedApplication = null;
  }

  public addToApplication(): void {
    this.fileUpload.upload();
  }

  public backToApplication(): void {
    const application: Deployment = Object.assign({}, this.passedApplication);

    this.cancelUpload();
    this.cancelAppDependenciesEvent.emit(application);
  }

  public customUpload(event): void {
    const application: Application = Object.assign({}, this.passedApplication);

    this.dependencyService.uploadDependencies(event, application.id)
      .then(res => {
        application.dependencies = res.data;

        this.uploadAppDependenciesEvent.emit(application);
      });
  }

  public cancelUpload(): void {
    this.fileUpload.clear();
  }
}
