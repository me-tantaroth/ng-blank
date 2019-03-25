import { Injectable } from '@angular/core';
import { StoreService } from 'ng-barn';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { LangsService } from '../../../langs/services/langs.service';
import { Accents } from '../../../shared/utils/accents';

import { Page } from '../models/page';

export interface ServiceResponse {
  list: Page[];
  index: number;
  value: Page;
}
@Injectable({
  providedIn: 'root'
})
export class PageService {
  private pages: Page[] = [];

  constructor(private store: StoreService, private langs: LangsService) {
    const langsNode = this.store.get('langs-node');

    this.pages = langsNode[this.langs.currentLang].pages || [];
  }

  list(): Observable<Page[]> {
    return new Observable((observer) => {
      observer.next(this.pages);
      observer.complete();
    });
  }

  item(uid): Observable<Page> {
    return new Observable((observer) => {
      observer.next(this.pages[uid]);
      observer.complete();
    });
  }

  filter(query): Observable<Page[]> {
    return new Observable((observer) => {
      observer.next(
        _.filter(
          this.pages,
          (page: Page) =>
            _.filter(Object.keys(query), (key) => {
              console.log('>>> PAGE', page)
              const slideValue = new Accents()
                .removeDiacritics(page[key])
                .toLowerCase()
                .replace(/[^\w\s]/gi, '')
                .replace(/[`~!@#$%^&*()_|+\-=÷¿?;°:'",.<>\{\}\[\]\\\/]/gi, '')
                .replace(/ /g, '');
              const filterValue = new Accents()
                .removeDiacritics(query[key])
                .toLowerCase()
                .replace(/[^\w\s]/gi, '')
                .replace(/[`~!@#$%^&*()_|+\-=÷¿?;°:'",.<>\{\}\[\]\\\/]/gi, '')
                .replace(/ /g, '');

              return slideValue.search(filterValue) >= 0;
            }).length > 0
        )
      );
      observer.complete();
    });
  }

  get(uid?): Observable<ServiceResponse> {
    return new Observable((observer) => {
      observer.next({
        list: this.pages,
        index: uid || null,
        value: uid ? this.pages[uid] : null
      });
      observer.complete();
    });
  }

  set(query, data: Page): Observable<ServiceResponse> {
    return new Observable((observer) => {
      this.filter(query)
        .subscribe((pages: Page[]) => {
          if (pages.length > 0) {
            this.pages = _.map(this.pages, (page: Page) => {
              let result: Page = page;

              if (page.uid === data.uid) {
                result = data;
              }

              return result;
            });
          }

          observer.next({
            list: this.pages,
            index: data.index,
            value: data
          });
        })
        .unsubscribe();
      observer.complete();
    });
  }

  push(value: Page): Observable<ServiceResponse> {
    return new Observable((observer) => {
      this.pages.push(value);

      observer.next({
        list: this.pages,
        index: this.pages.length - 1,
        value
      });
      observer.complete();
    });
  }
}
