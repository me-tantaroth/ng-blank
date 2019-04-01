import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

import { PageService } from '../../core/pages/services/page.service';
import { Page } from '../../core/pages/models/page';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  pages: Observable<Page[]>;

  constructor(private pageService: PageService) {}

  ngOnInit() {
    this.pages = this.pageService
      .list()
      .pipe(
        map((pages: Page[]) =>
          _.filter(pages, (o) => !o.blocked && o.path === 'home')
        )
      );

    this.pages.subscribe(console.log);
  }
}
