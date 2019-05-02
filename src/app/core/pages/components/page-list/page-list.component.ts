import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';
import * as _ from 'lodash';
import { StoreService } from 'ng-barn';

import { ModulesService } from '../../../modules/services/modules.service';
import { UserService } from '../../../users/services/user.service';
import { PageService } from '../../services/page.service';

import { Module } from '../../../../core/modules/models/module';
import { User } from '../../../../core/users/models/user';
import { Page } from '../../models/page';

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
  pages: Observable<Page[]>;
  backPage: Observable<Page[]>;

  constructor(
    private store: StoreService,
    private modulesService: ModulesService,
    private userService: UserService,
    private pageService: PageService,
    private router: Router
  ) {
    router.events.subscribe((data) => {
      if (data instanceof ActivationEnd) {
        if (!!data.snapshot.params.filter && !!data.snapshot.params.value) {
          this.filter = data.snapshot.params.filter;
          this.value = data.snapshot.params.value;
          const currentPage = data.snapshot.params.value.split('|');

          currentPage.pop();

          switch (data.snapshot.params.filter) {
            case 'list':
              if (currentPage.join('|') !== '') {
                this.currentPage = this.pageService.getItem(
                  currentPage.join('|')
                );
              }
              this.pages = this.pageService.list(data.snapshot.params.value);
              break;
          }
        }
      }
    });
  }

  ngOnInit() {
    if (!!this.filter && !!this.value) {
      const currentPage = this.value.split('|');

      currentPage.pop();

      switch (this.filter) {
        case 'list':
          if (currentPage.join('|') !== '') {
            this.currentPage = this.pageService.getItem(currentPage.join('|'));
          }
          this.pages = this.pageService.list(this.value);
          break;
      }
    } else {
      this.filter = 'list';
      this.pages = this.pageService.list('|' + this.filter);
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

  onBlockPage(path: string, page: Page) {
    // const splitPath = path.split('|');
    // splitPath.shift();
    // splitPath.shift();
    // page.blocked = true;
    // console.log('## BLOCKED', path, page, '|blocked|' + splitPath.join('|'));
    // this.pageService
    //   .setItem('|blocked|' + splitPath.join('|'), page)
    //   .pipe(first())
    //   .subscribe((status: boolean) => {
    //     if (status) {
    //       this.pageService
    //         .removeItem('|enabled|list|' + splitPath.join('|'))
    //         .pipe(first())
    //         .subscribe((statusEnabled: boolean) => {
    //           if (statusEnabled) {
    //             this.onBackPage(page);
    //           }
    //         });
    //     }
    //   });
  }

  onUnBlockPage(path: string, page: Page) {
    // page.blocked = false;
    // this.pageService
    //   .setItem(path, page)
    //   .pipe(first())
    //   .subscribe((status: boolean) => {
    //     if (status) {
    //       this.pageService
    //         .removeItem('|blocked|' + page.uid)
    //         .pipe(first())
    //         .subscribe((statusRemoved: boolean) => {
    //           if (statusRemoved) {
    //             this.onBackPage(page);
    //           }
    //         });
    //     }
    //   });
  }

  onDeletePage(page: Page) {
    const pageModule$: Observable<Module> = this.modulesService.getItem(
      '|page'
    );
    const currentUser$: Observable<User> = this.userService.getItem(
      this.store.get('currentUserPermissions').path
    );

    if (confirm(`Seguro que desea eliminar a '${page.text}'?`)) {
      combineLatest([pageModule$, currentUser$])
        .pipe(first())
        .subscribe(([pageModule, currentUser]) => {
          if (currentUser.permissions.page_delete) {
            pageModule.count = pageModule.count - 1;

            this.modulesService
              .setItem('|page', pageModule)
              .pipe(first())
              .subscribe(() => {
                page.deleted = true;

                const path = page.customPath.split('|');

                path.pop();

                this.pageService
                  .removeItem(path.join('|'))
                  .pipe(first())
                  .subscribe(() => {
                    if (status) {
                      this.pageService
                        .removeItem('|enabled|' + page.uuid)
                        .pipe(first())
                        .subscribe();
                    }
                  });
              });
          } else {
            alert('Error!: No tiene los permisos suficientes para hacer esta acción!');
          }
        });
    }
  }

  onUnDeletedPage(path: string, page: Page) {
    page.deleted = false;

    // this.pageService
    //   .setItem(path, page)
    //   .pipe(first())
    //   .subscribe((status: boolean) => {
    //     if (status) {
    //       this.pageService
    //         .removeItem('|deleted|' + page.uid)
    //         .pipe(first())
    //         .subscribe((statusDeleted: boolean) => {
    //           if (statusDeleted) {
    //             this.pageList = this.pageService.list('|deleted');
    //           }
    //         });
    //     }
    //   });
  }
}
