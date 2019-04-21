import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import * as _ from 'lodash';

import { Config, ConfigService } from '../../shared/services/config.service';

import { PageService } from '../../core/pages/services/page.service';

import { Page } from '../../core/pages/models/page';

@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.component.html',
  styleUrls: ['./page-view.component.scss']
})
export class PageViewComponent implements OnInit {
  config: Observable<Config>;
  page: Observable<Page>;
  path: string;

  constructor(
    private configService: ConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private pageService: PageService
  ) {
    this.router.events.subscribe((data) => {
      if (data instanceof ActivationEnd) {
        if (!!data.snapshot.params.path) {
          this.getPage(data.snapshot.params.path);
        }
      }
    });

    this.config = this.configService.get();
  }

  ngOnInit() {
    const path = this.route.snapshot.paramMap.get('path');

    if (path) {
      this.getPage(path);
    } else {
      this.route.paramMap.pipe(first()).subscribe((params) => {
        this.getPage(params.get('path'));
      });
    }
  }

  getPage(path) {
    this.page = this.pageService.getItem('|list|' + path);
  }
}
