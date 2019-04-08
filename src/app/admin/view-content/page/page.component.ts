import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';
import { first } from 'rxjs/operators';

import { PageService } from '../../../core/pages/services/page.service';

import { Page } from '../../../core/pages/models/page';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  page: Page;
  filter: string;
  value: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pageService: PageService
  ) {
    this.router.events.subscribe((data) => {
      if (data instanceof ActivationEnd) {
        if (!!data.snapshot.params.filter) {
          this.filter = data.snapshot.params.filter;
        }
        if (!!data.snapshot.params.value) {
          this.value = data.snapshot.params.value;
        }
      }
    });
  }

  ngOnInit() {
    const value = this.route.snapshot.paramMap.get('value');

    if (value) {
      this.value = value;

      this.pageService
        .getItem(value)
        .subscribe((page: Page) => (this.page = page))
        .unsubscribe();
    } else {
      this.route.paramMap
        .subscribe((params) => {
          if (params.get('value')) {
            this.value = params.get('value');

            this.pageService
              .getItem(value)
              .pipe(first())
              .subscribe((page: Page) => (this.page = page));
          }
        })
        .unsubscribe();
    }

    const filter = this.route.snapshot.paramMap.get('filter');

    if (filter) {
      this.filter = filter;
    } else {
      this.filter = 'add';

      this.route.paramMap
        .subscribe((params) => {
          if (params.get('filter')) {
            this.filter = params.get('filter');
          }
        })
        .unsubscribe();
    }
  }
}
