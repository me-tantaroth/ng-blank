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
  config: Observable<Config>;
  page: Observable<Page>;

  constructor(
    private configService: ConfigService,
    private pageService: PageService
  ) {
    this.config = this.configService.get();
  }

  ngOnInit() {
    this.page = this.pageService
      .list('|list')
      .pipe(
        map((pages: Page[]) => {
          return pages[_.filter(
            Object.keys(pages),
            (k) => !pages[k].blocked && pages[k].url === 'home'
          )[0]];
        })
      );
  }
}
