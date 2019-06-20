import {Component, OnInit} from '@angular/core';
import {ShareDataService} from '@win-angular/services';
import {NgxPermissionsService} from 'ngx-permissions';
import {Message} from 'primeng/api';
import {Permissions} from './model/permissions';
import {PermissionsService} from './services/permission/permission.service';

@Component({
  selector: 'apm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public growlSuccessMessages: Message[] = [];
  public growlErrorMessages: Message[] = [];

  public isBlockedUI = false;
  public growlErrorMessageShow = false;
  public growlSuccessMessageShow = false;

  private permissions: Permissions;

  ngOnInit(): void {
    this.permissionsService.findUserPermissions()
      .subscribe(response => {
        this.permissions = response.data;
        this.ngx.loadPermissions(this.permissions.groups);
      });
  }

  constructor(private shareDataService: ShareDataService, private permissionsService: PermissionsService, private ngx: NgxPermissionsService) {
    const self = this;

    this.shareDataService.blockUISource.subscribe(
      isBlockUI => {
        setTimeout(() => {
          self.isBlockedUI = isBlockUI;
        });
      }
    );

    this.shareDataService.showStatusMessage.subscribe((item) => {
      if (item[0].severity === 'error') {
        self.growlSuccessMessageShow = false;
        self.growlErrorMessageShow = true;
        self.growlErrorMessages = item;
      } else if (item[0].severity === 'close') {
        self.growlErrorMessageShow = false;
      } else {
        self.growlErrorMessageShow = false;
        self.growlSuccessMessageShow = true;
        self.growlSuccessMessages = item;
      }
    });
  }
}
