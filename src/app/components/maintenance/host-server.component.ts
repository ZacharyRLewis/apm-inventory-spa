import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ModalService, ShareDataService} from '@win-angular/services';
import {HostServer, Permissions} from '../../model';
import {DeploymentService, HostServerService} from '../../services';

@Component({
  selector: 'apm-host-server',
  templateUrl: './host-server.component.html',
  styleUrls: ['./host-server.component.scss']
})
export class HostServerComponent {

  @Input() modalId: string;
  @Input() permissions: Permissions;
  @Output() createEvent: EventEmitter<HostServer> = new EventEmitter<HostServer>();
  @Output() deleteEvent: EventEmitter<HostServer> = new EventEmitter<HostServer>();
  @Output() updateEvent: EventEmitter<HostServer> = new EventEmitter<HostServer>();

  public model: HostServer = new HostServer();
  public passedHostServer: HostServer;
  public environments: string[] = ['DEV', 'QA', 'PROD'];
  public operatingSystems: string[] = ['AS400', 'LINUX', 'WINDOWS'];
  public deploymentUses = 0;

  @ViewChild('newHostServerForm')
  public newHostServerForm;

  constructor(private deploymentService: DeploymentService, private hostServerService: HostServerService,
              private modalService: ModalService, private shareDataService: ShareDataService) {
    this.setDefaultValues();
  }

  public setDefaultValues(): void {
    this.model.id = null;
    this.model.name = '';
    this.model.operatingSystem = '';
    this.model.environment = '';
  }

  public loadDeploymentUses = () => {
    const params = [{name: 'hostServerId', value: this.passedHostServer.id}];

    this.deploymentService.filterAll(params)
      .subscribe(response => {
        this.deploymentUses = response.data.length;
      });
  }

  public closeModal(): void {
    this.modalService.closeModal(this.modalId);
    this.newHostServerForm.resetForm();
  }

  public hasAdminPermissions(): boolean {
    return this.permissions.permissions.indexOf('APM_Admin') >= 0;
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

    if (!this.hasAdminPermissions()) {
      this.shareDataService.showStatus([{severity: 'error', summary: 'You are not authorized to create a host server'}]);
      return;
    }

    this.hostServerService.create(created)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.createEvent.emit(created);
        },
        err => {
          this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(create hostServer) >> ' + err.message}]);
        });
  }

  public updateHostServer(): void {
    const updated: HostServer = Object.assign({}, this.model);

    if (!this.hasAdminPermissions()) {
      this.shareDataService.showStatus([{severity: 'error', summary: 'You are not authorized to update a host server'}]);
      return;
    }

    this.hostServerService.update(updated)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.updateEvent.emit(updated);
        },
        err => {
          this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(update hostServer) >> ' + err.message}]);
        });
  }

  public deleteHostServer(): void {
    const deleted: HostServer = Object.assign({}, this.model);

    if (!this.hasAdminPermissions()) {
      this.shareDataService.showStatus([{severity: 'error', summary: 'You are not authorized to delete a host server'}]);
      return;
    }

    if (this.deploymentUses > 0) {
      this.shareDataService.showStatus([{severity: 'error', summary: 'This host server cannot be deleted because it is in use'}]);
      return;
    }

    this.hostServerService.delete(deleted)
      .subscribe(res => {
          this.closeModal();
          this.setDefaultValues();
          this.deleteEvent.emit(deleted);
        },
        err => {
          this.shareDataService.showStatus([{severity: 'error', summary: 'ERR:(delete hostServer) >> ' + err.message}]);
        });
  }
}
