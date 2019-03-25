import { Injectable } from '@angular/core';
import { StoreService } from 'ng-barn';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { LangsService } from '../../langs/services/langs.service';

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

  filter(key, validate): Observable<User> {
    return new Observable((observer) => {
      console.log(_.filter(this.users, (o) => o[key] === validate));
      observer.next(this.users[0]);
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

  set(key, value: User): Observable<ServiceResponse> {
    return new Observable((observer) => {
      observer.next({
        list: this.users,
        index: key,
        value: this.users[key] = value
      });
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
