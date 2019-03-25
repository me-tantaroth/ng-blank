import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { PageService, ServiceResponse as PageServiceResponse } from '../../services/page.service';

import { Page } from '../../models/page';

@Component({
  selector: 'app-view-content',
  templateUrl: './view-content.component.html',
  styleUrls: ['./view-content.component.scss']
})
export class ViewContentComponent implements OnInit {
  page: Observable<Page>;

  constructor(
    private route: ActivatedRoute,
    private pageService: PageService
  ) {}

  ngOnInit() {
    let pageId = this.route.snapshot.paramMap.get('pageId');

    if (pageId) {
      this.page = this.pageService.filter('uid', pageId);
    } else {
      this.route.paramMap
        .subscribe((params) => {
          pageId = params.get('pageId');

          this.page = this.pageService.filter('uid', pageId);
        })
        .unsubscribe();
    }
  }
}
