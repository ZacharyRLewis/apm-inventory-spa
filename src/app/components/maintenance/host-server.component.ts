import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModalService} from '@win-angular/services';
import {HostServer} from '../../model';
import {HostServerService} from '../../services';

@Component({
  selector: 'apm-host-server',
  templateUrl: './host-server.component.html',
  styleUrls: ['./host-server.component.scss']
})
export class HostServerComponent {

  @Input() modalId: string;
  @Output() createEvent: EventEmitter<HostServer> = new EventEmitter<HostServer>();
  @Output() deleteEvent: EventEmitter<HostServer> = new EventEmitter<HostServer>();
  @Output() updateEvent: EventEmitter<HostServer> = new EventEmitter<HostServer>();

  model: HostServer = new HostServer();
  passedHostServer: HostServer;
  environments: string[] = ['DEV', 'QA', 'PROD'];
  operatingSystems: string[] = ['AS400', 'LINUX', 'WINDOWS'];

  constructor(private hostServerService: HostServerService, private modalService: ModalService) {
    this.setDefaultValues();
  }

  public setDefaultValues(): void {
    this.model.id = null;
    this.model.name = '';
    this.model.operatingSystem = '';
    this.model.environment = '';
  }

  public closeModal(): void {
    this.modalService.closeModal(this.modalId);
  }

  public saveHostServer(): void {
    if (this.passedHostServer) {
      this.updateHostServer();
    } else {
      this.createHostServer();
    }
  }

  public createHostServer(): void {
    const created: HostServer = Object.assign({}, this.model);

    this.hostServerService.create(created)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.createEvent.emit(created);
        },
        err => {
          console.log('ERR:(create hostServer) >> ' + err.message);
        });
  }

  public updateHostServer(): void {
    const updated: HostServer = Object.assign({}, this.model);

    this.hostServerService.update(updated)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.updateEvent.emit(updated);
        },
        err => {
          console.log('ERR:(update hostServer) >> ' + err.message);
        });
  }

  public deleteHostServer(): void {
    const deleted: HostServer = Object.assign({}, this.model);

    this.hostServerService.delete(deleted)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.deleteEvent.emit(deleted);
        },
        err => {
          console.log('ERR:(delete hostServer) >> ' + err.message);
        });
  }
}
