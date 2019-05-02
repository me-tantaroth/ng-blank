import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
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
    private title: Title,
    private meta: Meta,
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
    this.page = this.pageService.getItem('|list|' + path).pipe(
      map((page: Page) => {
        this.title.setTitle(page.text);
        this.meta.addTags([
          { name: 'description', content: page.description },
          { name: 'keywords', content: page.keywords },
          { name: 'theme-color', content: page.theme.color },
          { name: 'twitter:card', content: 'summary' },
          { name: 'og:url', content: page.url },
          { name: 'og:title', content: page.text },
          { name: 'og:description', content: page.description },
          { name: 'og:image', content: page.image }
        ]);
        console.log('## PAGE', page);
        return page;
      })
    );
  }
}
