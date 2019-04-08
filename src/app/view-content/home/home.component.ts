import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

import { Config, ConfigService } from '../../shared/services/config.service';

import { PageService } from '../../core/pages/services/page.service';
import { Page } from '../../core/pages/models/page';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  config: Config;
  pages: Observable<Page[]>;

  constructor(
    private configService: ConfigService,
    private pageService: PageService
  ) {
    this.config = this.configService.get();
  }

  ngOnInit() {
    // this.pages = this.pageService
    //   .list()
    //   .pipe(
    //     map((pages: Page[]) =>
    //       _.filter(pages, (o) => !o.blocked && o.path === 'home')
    //     )
    //   );

    this.pages.subscribe(console.log);
  }
}
