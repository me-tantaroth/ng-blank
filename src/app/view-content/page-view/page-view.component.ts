import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { PageService } from '../../core/pages/services/page.service';

import { Page } from '../../core/pages/models/page';

@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.component.html',
  styleUrls: ['./page-view.component.scss']
})
export class PageViewComponent implements OnInit {
  pages: Observable<Page[]>;

  constructor(
    private route: ActivatedRoute,
    private pageService: PageService
  ) {}

  ngOnInit() {
    let uid = this.route.snapshot.paramMap.get('uid');

    if (uid) {
      this.pages = this.pageService.filter({uid});
    } else {
      this.route.paramMap
        .subscribe((params) => {
          uid = params.get('uid');

          this.pages = this.pageService.filter({uid});
        })
        .unsubscribe();
    }
  }
}
