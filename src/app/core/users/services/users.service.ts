import { Injectable } from '@angular/core';
import { StoreService } from 'ng-barn';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { LangsService } from '../../../langs/services/langs.service';
import { Accents } from '../../../shared/utils/accents';

import { User } from '../models/user';

export interface ServiceResponse {
  list: User[];
  index: number;
  value: User;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];

  constructor(private store: StoreService, private langs: LangsService) {
    const langsNode = this.store.get('langs-node');

    this.users = langsNode[this.langs.currentLang].users || [];
  }

  list(): Observable<User[]> {
    return new Observable((observer) => {
      console.log('>>>', this.users);
      observer.next(this.users);
      observer.complete();
    });
  }

  item(key): Observable<User> {
    return new Observable((observer) => {
      observer.next(this.users[key]);
      observer.complete();
    });
  }

  filter(query): Observable<User[]> {
    return new Observable((observer) => {
      observer.next(
        _.filter(
          this.users,
          (user: User) =>
            _.filter(Object.keys(query), (key) => {
              const slideValue = new Accents()
                .removeDiacritics(user[key])
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

  get(key?): Observable<ServiceResponse> {
    return new Observable((observer) => {
      observer.next({
        list: this.users,
        index: key || null,
        value: key ? this.users[key] : null
      });
      observer.complete();
    });
  }

  set(query, data: User): Observable<ServiceResponse> {
    return new Observable((observer) => {
      this.filter(query)
        .subscribe((users: User[]) => {
          if (users.length > 0) {
            this.users = _.map(this.users, (user: User) => {
              let result: User = user;

              if (user.uid === data.uid) {
                result = data;
              }

              return result;
            });
          }

          observer.next({
            list: this.users,
            index: data.index,
            value: data
          });
        })
        .unsubscribe();
      observer.complete();
    });
  }

  push(value: User): Observable<ServiceResponse> {
    return new Observable((observer) => {
      this.users.push(value);

      observer.next({
        list: this.users,
        index: this.users.length - 1,
        value
      });
      observer.complete();
    });
  }
}
