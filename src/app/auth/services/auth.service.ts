import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';

interface Response {
  status: boolean;
  data?: any;
  error?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private store: StoreService) {}

  get authenticated(): Observable<boolean> {
    const authEmailLocal = window.localStorage.getItem('authenticated-email');
    return new Observable((observer) => {
      observer.next(!!authEmailLocal);
      observer.complete();
    });
  }

  emailSignIn(email: string, passowrd: string): Observable<Response> {
    const results = _.filter(this.store.get('users'), function(item) {
      return item.email.indexOf(email) > -1;
    });
    return new Observable((observer) => {
      if (results.length > 0) {
        window.localStorage.setItem('authenticated-email', email);

        observer.next({
          status: true
        });
      } else {
        observer.next({
          status: false,
          error: 'User not found'
        });
      }
      observer.complete();
    });
  }

  signOut(): Observable<Response> {
    return new Observable((observer) => {
      window.localStorage.removeItem('authenticated-email');

      observer.next({
        status: true
      });
      observer.complete();
    });
  }
}
