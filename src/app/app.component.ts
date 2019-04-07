import { Component } from '@angular/core';

import { StoreService } from 'ng-barn';
import { ConfigService } from './shared/services/config.service';
import { LAYOUTS } from './layouts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-blank';

  constructor(
    private store: StoreService,
    private configService: ConfigService
  ) {
    const PROJECT_ID = 'ng-fire-blank';

    const NODE = this.store.get('node');

    this.configService.set({
      project: {
        uid: PROJECT_ID,
        layout: LAYOUTS[NODE[PROJECT_ID]] ? NODE[PROJECT_ID] : 'default',
        lang: 'es'
      }
    });
  }
}
