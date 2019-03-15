import {Component} from '@angular/core';
import {ShareDataService} from '@win-angular/services';

@Component({
  selector: 'apm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isBlockedUI = false;

  constructor(private shareDataService: ShareDataService) {
    const self = this;

    this.shareDataService.blockUISource.subscribe(
      isBlockUI => {
        setTimeout(() => {
          self.isBlockedUI = isBlockUI;
        });
      }
    );
  }
}
