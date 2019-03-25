import { Injectable } from '@angular/core';
import { StoreService } from 'ng-barn';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { LangsService } from '../../langs/services/langs.service';

import { Menu } from '../models/menu';

export interface ServiceResponse {
  list: Menu[];
  index: number;
  value: Menu;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menus: Menu[] = [];

  constructor(private store: StoreService, private langs: LangsService) {
    const langsNode = this.store.get('langs-node');

    this.menus = langsNode[this.langs.currentLang].menus || [];
  }

  list(): Observable<Menu[]> {
    return new Observable((observer) => {
      observer.next(this.menus);
      observer.complete();
    });
  }

  item(index): Observable<Menu> {
    return new Observable((observer) => {
      observer.next(this.menus[index]);
      observer.complete();
    });
  }

  filter(key, validate): Observable<Menu> {
    return new Observable((observer) => {
      console.log(_.filter(this.menus, (o) => o[key] === validate));
      observer.next(this.menus[0]);
      observer.complete();
    });
  }

  get(index?): Observable<ServiceResponse> {
    return new Observable((observer) => {
      observer.next({
        list: this.menus,
        index: index || null,
        value: index ? this.menus[index] : null
      });
      observer.complete();
    });
  }

  set(index, value: Menu): Observable<ServiceResponse> {
    return new Observable((observer) => {
      observer.next({
        list: this.menus,
        index: index,
        value: this.menus[index] = value
      });
      observer.complete();
    });
  }

  push(value: Menu): Observable<ServiceResponse> {
    return new Observable((observer) => {
      this.menus.push(value);

      observer.next({
        list: this.menus,
        index: this.menus.length - 1,
        value
      });
      observer.complete();
    });
  }
}
