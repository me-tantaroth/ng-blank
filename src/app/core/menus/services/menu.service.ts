import { Injectable } from '@angular/core';
import { StoreService } from 'ng-barn';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

import { LangsService } from '../../../langs/services/langs.service';
import { Accents } from '../../../shared/utils/accents';

import { Menu } from '../models/menu';

export interface ServiceResponse {
  list: Menu[];
  value: Menu;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menu: Menu[] = [];
  private menuDelete: Menu[] = [];

  constructor(private store: StoreService, private langs: LangsService) {
    const langsNode = this.store.get('langs-node');

    this.menu = langsNode[this.langs.currentLang].menu || [];
  }

  list(): Observable<Menu[]> {
    return new Observable((observer) => {
      observer.next(this.menu);
      observer.complete();
    });
  }

  listWithPath(path: string): Observable<Menu[]> {
    return new Observable((observer) => {
      const splitPath: string[] = path.split('|');

      splitPath.shift();

      const cursors = splitPath.map((o) => `['${o}']`).join('');
      const menuList: Menu[] = this.menu;
      let result: Menu[];
      const updateAction = `result = menuList${cursors}.menu`;

      eval(updateAction);

      if (result) {
        observer.next(result);
        observer.complete();
      } else {
        this.filter({ path })
          .subscribe((menu: Menu[]) => {
            observer.next(menu);
            observer.complete();
          })
          .unsubscribe();
      }
    });
  }

  item(index): Observable<Menu> {
    return new Observable((observer) => {
      observer.next(this.menu[index]);
      observer.complete();
    });
  }

  itemWithPath(path: string): Observable<Menu> {
    return new Observable((observer) => {
      const splitPath: string[] = path.split('|');

      splitPath.shift();

      const cursors = splitPath.map((o) => `['${o}']`).join('');
      const menuList: Menu[] = this.menu;
      let result: Menu;
      const updateAction = `result = menuList${cursors}`;

      eval(updateAction);

      if (result) {
        observer.next(result);
        observer.complete();
      } else {
        this.filter({ path })
          .pipe(map((o) => (o.length === 1 ? o[0] : undefined)))
          .subscribe((menu: Menu) => {
            console.log('?????', menu);
            observer.next(menu);
            observer.complete();
          })
          .unsubscribe();
      }
    });
  }

  filter(query): Observable<Menu[]> {
    return new Observable((observer) => {
      observer.next(
        _.filter(
          this.menu,
          (menu: Menu) =>
            _.filter(Object.keys(query), (key) => {
              const slideValue = new Accents()
                .removeDiacritics(menu[key].toString())
                .toLowerCase()
                .replace(/[^\w\s]/gi, '')
                .replace(/[`~!@#$%^&*()_|+\-=÷¿?;°:'",.<>\{\}\[\]\\\/]/gi, '')
                .replace(/ /g, '');
              const filterValue = new Accents()
                .removeDiacritics(query[key].toString())
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

  filterWithPath(path: string, query): Observable<Menu[]> {
    return new Observable((observer) => {
      const splitPath: string[] = path.split('|');

      splitPath.shift();

      const cursors = splitPath.map((o) => `['${o}']`).join('');
      const menuList: Menu[] = this.menu;
      let result: Menu[];
      const updateAction = `result = menuList${cursors}.menu`;

      eval(updateAction);

      if (result) {
        observer.next(
          _.filter(
            result,
            (menu: Menu) =>
              _.filter(Object.keys(query), (key) => {
                const slideValue = new Accents()
                  .removeDiacritics(menu[key].toString())
                  .toLowerCase()
                  .replace(/[^\w\s]/gi, '')
                  .replace(/[`~!@#$%^&*()_|+\-=÷¿?;°:'",.<>\{\}\[\]\\\/]/gi, '')
                  .replace(/ /g, '');
                const filterValue = new Accents()
                  .removeDiacritics(query[key].toString())
                  .toLowerCase()
                  .replace(/[^\w\s]/gi, '')
                  .replace(/[`~!@#$%^&*()_|+\-=÷¿?;°:'",.<>\{\}\[\]\\\/]/gi, '')
                  .replace(/ /g, '');

                  console.log('------------------------->', slideValue,  filterValue)
                return slideValue.search(filterValue) >= 0;
              }).length > 0
          )
        );
        observer.complete();
      } else {
        this.filter({ path })
          .pipe(map((o) => (o.length === 1 ? o[0] : undefined)))
          .subscribe((menu: Menu) => {
            console.log('?????', menu);
          })
          .unsubscribe();
      }
    });
  }

  get(index?): Observable<ServiceResponse> {
    return new Observable((observer) => {
      observer.next({
        list: this.menu,
        value: index ? this.menu[index] : null
      });
      observer.complete();
    });
  }

  set(query, data: Menu): Observable<ServiceResponse> {
    return new Observable((observer) => {
      this.filter(query)
        .subscribe((menu: Menu[]) => {
          if (menu.length > 0) {
            this.menu = _.map(this.menu, (menu: Menu) => {
              let result: Menu = menu;

              return result;
            });
          }

          observer.next({
            list: this.menu,
            value: data
          });
        })
        .unsubscribe();
      observer.complete();
    });
  }

  setWithPath(path: string, value: Menu): Observable<ServiceResponse> {
    return new Observable((observer) => {
      const splitPath: string[] = path.split('|');

      splitPath.shift();

      const cursors = splitPath.map((o) => `['${o}']`).join('');
      const menuList: Menu[] = this.menu;
      const updateAction = `menuList${cursors} = value`;

      eval(updateAction);

      observer.next({
        list: this.menu = menuList,
        value
      });
      observer.complete();
    });
  }

  push(value: Menu): Observable<ServiceResponse> {
    return new Observable((observer) => {
      this.menu.push(value);

      observer.next({
        list: this.menu,
        value
      });
      observer.complete();
    });
  }

  pushWithPath(path: string, value: Menu): Observable<ServiceResponse> {
    return new Observable((observer) => {
      const splitPath: string[] = path.split('|');

      splitPath.shift();

      const cursors = splitPath.map((o) => `['${o}']`).join('');
      const menuList: Menu[] = this.menu;
      const updateAction = `menuList${cursors}.menu.push(value)`;

      console.log('>>>>>>>>>>>>> CODE', updateAction);

      console.log('>>>>>>>>>>>> RESULT', menuList);

      eval(updateAction);

      observer.next({
        list: this.menu = menuList,
        value
      });
      observer.complete();
    });
  }
}
