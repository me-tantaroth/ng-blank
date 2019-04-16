import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import * as _ from 'lodash';

import { PageService } from '../../services/page.service';

import { Page, Pages } from '../../models/page';

@Component({
  selector: 'app-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss']
})
export class PageListComponent implements OnInit {
  @Input() filter: string;
  @Input() value: string;

  ObjectKeys = Object.keys;
  panelOpenState: boolean;
  currentPage: Observable<Page>;
  pageList: Observable<Pages>;
  backPage: Observable<Pages>;

  constructor(private pageService: PageService, private router: Router) {
    router.events.subscribe((data) => {
      if (data instanceof ActivationEnd) {
        if (
          !!data.snapshot.params.filter &&
          data.snapshot.params.filter === 'enabled|list' &&
          !!data.snapshot.params.value
        ) {
          this.currentPage = this.pageService.getItem(
            data.snapshot.params.value
          );
          this.pageList = this.pageService.list(
            data.snapshot.params.value + '|enabled|list'
          );
        } else {
          if (
            !!data.snapshot.params.filter &&
            (data.snapshot.params.filter === 'enabled|list' ||
              data.snapshot.params.filter === 'blocked' ||
              data.snapshot.params.filter === 'deleted') &&
            !data.snapshot.params.value
          ) {
            console.log('¡?¡¡¡¡¡¡¡¡', data.snapshot.params.filter);
            this.pageList = this.pageService.list(
              '|' + data.snapshot.params.filter
            );
          }
        }
      }
    });
  }

  ngOnInit() {
    if (!!this.filter && this.filter === 'enabled|list' && !!this.value) {
      console.log('## FILTER PATH');
      this.currentPage = this.pageService.getItem(this.value);

      this.pageList = this.pageService.list(this.value + '|enabled|list');
    } else {
      this.filter = this.filter || 'enabled|list';

      console.log('## ONLY NOT DELETED');
      this.pageList = this.pageService.list('|' + this.filter);
      this.pageList.subscribe((data) => console.log('QQQQ', data));
    }
  }

  onAddPage(page: Page) {
    if (page) {
      if (!!this.filter && this.filter === 'path' && !!this.value) {
        this.router.navigate(['/admin/page/form/add', this.value]);
      } else {
        this.router.navigate(['/admin/page/form/add']);
      }
    } else {
      this.router.navigate(['/admin/page/form/add']);
    }
  }

  onBackPage(page: Page) {
    if (page) {
      this.router.navigate([
        '/admin/page/list/' + (this.filter || 'enabled|list'),
        page.backPath || ''
      ]);
    }
  }

  onBlockPage(path: string, page: Page) {
    const splitPath = path.split('|');
    splitPath.shift();
    splitPath.shift();

    page.blocked = true;

    console.log('## BLOCKED', path, page, '|blocked|' + splitPath.join('|'));

    this.pageService
      .setItem('|blocked|' + splitPath.join('|'), page)
      .pipe(first())
      .subscribe((status: boolean) => {
        if (status) {
          this.pageService
            .removeItem('|enabled|list|' + splitPath.join('|'))
            .pipe(first())
            .subscribe((statusEnabled: boolean) => {
              if (statusEnabled) {
                this.onBackPage(page);
              }
            });
        }
      });
  }

  onUnBlockPage(path: string, page: Page) {
    page.blocked = false;

    this.pageService
      .setItem(path, page)
      .pipe(first())
      .subscribe((status: boolean) => {
        if (status) {
          this.pageService
            .removeItem('|blocked|' + page.uid)
            .pipe(first())
            .subscribe((statusRemoved: boolean) => {
              if (statusRemoved) {
                this.onBackPage(page);
              }
            });
        }
      });
  }

  onDeletePage(path: string, page: Page) {
    if (confirm(`Seguro que desea eliminar a '${page.title}'?`)) {
      page.deleted = true;

      this.pageService
        .setItem(path, page)
        .pipe(first())
        .subscribe((status: boolean) => {
          if (status) {
            this.pageService
              .removeItem('|enabled|list|' + page.uid)
              .pipe(first())
              .subscribe((statusEnabled: boolean) => {
                if (statusEnabled) {
                  this.pageList = this.pageService.list('|enabled|list');
                }
              });
          }
        });
    }
  }

  onUnDeletedPage(path: string, page: Page) {
    page.deleted = false;

    this.pageService
      .setItem(path, page)
      .pipe(first())
      .subscribe((status: boolean) => {
        if (status) {
          this.pageService
            .removeItem('|deleted|' + page.uid)
            .pipe(first())
            .subscribe((statusDeleted: boolean) => {
              if (statusDeleted) {
                this.pageList = this.pageService.list('|deleted');
              }
            });
        }
      });
  }
}
