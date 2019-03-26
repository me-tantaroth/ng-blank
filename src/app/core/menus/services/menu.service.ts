import { Injectable } from '@angular/core';
import { StoreService } from 'ng-barn';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { LangsService } from '../../../langs/services/langs.service';
import { Accents } from '../../../shared/utils/accents';

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

  filter(query): Observable<Menu[]> {
    return new Observable((observer) => {
      observer.next(
        _.filter(
          this.menus,
          (menu: Menu) =>
            _.filter(Object.keys(query), (key) => {
              const slideValue = new Accents()
                .removeDiacritics(menu[key])
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

  filterWithPath(path: string): Observable<Menu> {
    return new Observable((observer) => {
      const splitPath: string[] = path.split('|');

      splitPath.shift();

      const cursors = splitPath.map(o => `['${ o }']`).join('');

      const menuList: Menu[] = this.menus;
      let result: Menu;

      const updateAction = `result = menuList${ cursors }`;

      eval(updateAction);

      observer.next(result);
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

  set(query, data: Menu): Observable<ServiceResponse> {
    return new Observable((observer) => {
      this.filter(query)
        .subscribe((menus: Menu[]) => {
          if (menus.length > 0) {
            this.menus = _.map(this.menus, (menu: Menu) => {
              let result: Menu = menu;

              if (menu.uid === data.uid) {
                result = data;
              }

              return result;
            });
          }

          observer.next({
            list: this.menus,
            index: data.index,
            value: data
          });
        })
        .unsubscribe();
      observer.complete();
    });
  }

  pushWithPath(path: string, value: Menu): Observable<ServiceResponse> {
    return new Observable((observer) => {
      const splitPath: string[] = path.split('|');

      splitPath.shift();

      const cursors = splitPath.map(o => `['${ o }']`).join('');

      const menuList: Menu[] = this.menus;

      const updateAction = `menuList${ cursors }.submenu.push(value)`;

      console.log('>>>>>>>>>>>>> CODE', updateAction);

      console.log('>>>>>>>>>>>> RESULT', menuList);

      eval(updateAction);

      observer.next({
        list: this.menus = menuList,
        index: this.menus.length - 1,
        value
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
