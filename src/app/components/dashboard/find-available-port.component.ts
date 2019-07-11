import {Component, Input} from '@angular/core';
import {ModalService, ShareDataService} from '@win-angular/services';
import {Deployment, HostServer} from '../../model';
import {DeploymentService} from '../../services';

@Component({
  selector: 'apm-find-available-port',
  templateUrl: './find-available-port.component.html',
  styleUrls: ['./find-available-port.component.scss']
})
export class FindAvailablePortComponent {

  private readonly MAX_SUGGESTIONS: number = 10;

  @Input() modalId: string;
  @Input() hostServers: HostServer[] = [];

  public hostServerId = '';
  public serverNamePattern = '';
  public rangeStart = undefined;
  public rangeEnd = undefined;
  public hostServerIds: string[] = [];
  public ports: number[] = [];
  public deploymentsInPortRange: Deployment[] = [];

  constructor(private deploymentService: DeploymentService, private modalService: ModalService, private shareDataService: ShareDataService) {
    this.setDefaultValues();
  }

  public setDefaultValues(): void {
    this.hostServerId = '';
    this.serverNamePattern = '';
    this.rangeStart = undefined;
    this.rangeEnd = undefined;
    this.hostServerIds = [];
    this.ports = [];
    this.deploymentsInPortRange = [];
  }

  public closeModal(): void {
    this.modalService.closeModal(this.modalId);
  }

  /**
   * Callback function to be called when the user presses the back button in the browser.
   * Closes the modal and unregisters the event listener.
   */
  public backButtonCallback = () => {
    this.modalService.unregisterPopState(this.backButtonCallback);
    this.modalService.closeModal(this.modalId);
  }

  public findPorts(): void {
    this.shareDataService.blockUI(true);

    if (this.hostServerId) {
      this.hostServerIds.push(this.hostServerId);
    } else {
      this.findHostServerIdsByNamePattern();
    }

    const params = [{name: 'hostServerIds', value: this.hostServerIds}];
    const self = this;

    this.deploymentService.filterAll(params)
      .subscribe(response => {
        self.getPortSuggestions(response.data);

        this.shareDataService.blockUI(false);
      });
  }

  public getPortSuggestions(deployments: Deployment[]): void {
    this.ports = [];
    this.deploymentsInPortRange = [];

    for (let i = this.rangeStart; i <= this.rangeEnd; i++) {
      let addPort = true;

      if (this.ports.length === this.MAX_SUGGESTIONS) {
        break;
      }
      for (const deployment of deployments) {
        if (this.ports.length === this.MAX_SUGGESTIONS) {
          break;
        }
        if (deployment.port === i.toString()) {
          this.deploymentsInPortRange.push(deployment);
          addPort = false;
          break;
        }
      }

      if (addPort) {
        this.ports.push(i);
      }
    }
  }

  public findHostServerIdsByNamePattern() {
    this.hostServerIds = [];

    for (const hostServer of this.hostServers) {
      if (hostServer.name.startsWith(this.serverNamePattern)) {
        this.hostServerIds.push(hostServer.id);
      }
    }
  }

  public getDeploymentBaseUrl(deployment: Deployment): string {
    const hostServerName: string = this.getHostServerName(deployment.hostServerId);

    return Deployment.getBaseUrl(deployment, hostServerName);
  }

  public getHostServerName(hostServerId: string): string {
    if (!this.hostServers || !hostServerId) {
      return '';
    }
    for (const hostServer of this.hostServers) {
      if (hostServer.id == hostServerId) {
        return hostServer.name;
      }
    }
    return null;
  }
}
