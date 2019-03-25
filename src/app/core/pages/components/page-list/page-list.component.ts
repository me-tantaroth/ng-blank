import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

import { PageService } from '../../services/page.service';

import { Page } from '../../models/page';

@Component({
  selector: 'app-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss']
})
export class PageListComponent implements OnInit {
  @Input() filter: string;

  panelOpenState: boolean;
  pages: Observable<Page[]>;

  constructor(private pageService: PageService) {}

  ngOnInit() {
    this.pages = this.pageService.list().pipe(
      map((pages: Page[]) =>
        _.filter(pages, (o) => {
          let match: boolean;

          if (this.filter) {
            match = o[this.filter] === !!this.filter;
          } else {
            match = o.deleted === false;
          }

          return match;
        })
      )
    );
  }

  blockPage(uid: string, page: Page) {
    page.blocked = true;

    this.pageService.set({ uid }, page);
  }

  deletePage(uid: string, page: Page) {
    page.deleted = true;

    this.pageService.set({ uid }, page);
  }
}
