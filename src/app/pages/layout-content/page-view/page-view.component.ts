import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { PageService } from '../../services/page.service';

import { Page } from '../../models/page';

@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.component.html',
  styleUrls: ['./page-view.component.scss']
})
export class PageViewComponent implements OnInit {
  page: Observable<Page>;

  constructor(
    private route: ActivatedRoute,
    private pageService: PageService
  ) {}

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.page = this.pageService.filter('uid', id);
    } else {
      this.route.paramMap
        .subscribe((params) => {
          id = params.get('id');

          this.page = this.pageService.filter('uid', id);
        })
        .unsubscribe();
    }
  }
}
