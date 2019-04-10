import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { Config, ConfigService } from '../../shared/services/config.service';

import { PageService } from '../../core/pages/services/page.service';

import { Page, Pages } from '../../core/pages/models/page';

@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.component.html',
  styleUrls: ['./page-view.component.scss']
})
export class PageViewComponent implements OnInit {
  config: Config;
  pages: Observable<Pages>;

  constructor(
    private configService: ConfigService,
    private route: ActivatedRoute,
    private pageService: PageService
  ) {
    this.config = this.configService.get();
  }

  ngOnInit() {
    let path = this.route.snapshot.paramMap.get('path');

    // if (path) {
    //   this.pages = this.pageService.filter({ path });
    // } else {
    //   this.route.paramMap
    //     .subscribe((params) => {
    //       path = params.get('path');

    //       this.pages = this.pageService.filter({ path });
    //     })
    //     .unsubscribe();
    // }
  }
}
