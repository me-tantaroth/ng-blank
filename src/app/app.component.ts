import { Component } from '@angular/core';

import { ConfigService } from './shared/services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-blank';

  constructor(private configService: ConfigService) {
    this.configService.set({
      project: {
        uid: 'corpayande',
        name: 'Corpayande'
      }
    });
  }
}
