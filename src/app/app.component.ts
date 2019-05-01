import {Component} from '@angular/core';
import {ShareDataService} from '@win-angular/services';
import {Message} from 'primeng/api';

@Component({
  selector: 'apm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private growlSuccessMessages: Message[] = [];
  private growlErrorMessages: Message[] = [];

  public isBlockedUI = false;
  public growlErrorMessageShow = false;
  public growlSuccessMessageShow = false;

  constructor(private shareDataService: ShareDataService) {
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
