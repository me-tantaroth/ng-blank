import { Injectable } from '@angular/core';
import { StoreService } from 'ng-barn';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { LangsService } from '../../../langs/services/langs.service';

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

  item(index): Observable<Page> {
    return new Observable((observer) => {
      observer.next(this.pages[index]);
      observer.complete();
    });
  }

  filter(key, validate): Observable<Page> {
    return new Observable((observer) => {
      console.log(_.filter(this.pages, (o) => o[key] === validate));
      observer.next(this.pages[0]);
      observer.complete();
    });
  }

  get(index?): Observable<ServiceResponse> {
    return new Observable((observer) => {
      observer.next({
        list: this.pages,
        index: index || null,
        value: index ? this.pages[index] : null
      });
      observer.complete();
    });
  }

  set(index, value: Page): Observable<ServiceResponse> {
    return new Observable((observer) => {
      observer.next({
        list: this.pages,
        index: index,
        value: this.pages[index] = value
      });
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
