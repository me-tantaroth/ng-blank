import { Injectable, ɵConsole } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { UserService } from '../../../core/users/services/users.service';

import { User, Users } from '../../../core/users/models/user';

export interface ServiceResponse {
  status: boolean;
  data?: any;
  error?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: Observable<Users>;

  constructor(private usersService: UserService) {
    this.users = this.usersService.list();
  }

  get authenticated(): Observable<boolean> {
    return new Observable((observer) => {
      this.getUser()
        .subscribe((response) => {
          if (response.status) {
            if (response.data && !response.data.emailVerified) {
              observer.next(false);
              observer.complete();
            } else {
              observer.next(true);
              observer.complete();
            }
          } else {
            observer.next(false);
            observer.complete();
          }
        })
        .unsubscribe();
    });
  }

  getUser(): Observable<ServiceResponse> {
    return new Observable((observer) => {
      this.users
        .subscribe((users: Users) => {
          const results = _.filter(Object.keys(users), function(key) {
            return users[key] && users[key].email
              ? users[key].email.search(
                  window.localStorage.getItem('authenticated-email')
                ) > -1
              : false;
          });

          observer.next({
            status: !!results[0],
            data: users[results[0]]
          });
        })
        .unsubscribe();
    });
  }

  emailSignIn(email: string, passowrd: string): Observable<ServiceResponse> {
    return new Observable((observer) => {
      this.users
        .subscribe((users: Users) => {
          const results = _.filter(Object.keys(users), (key) =>
            users[key] && users[key].email
              ? users[key].email.search(email) > -1
              : false
          );

          if (results.length > 0 && users[results[0]].emailVerified) {
            window.localStorage.setItem('authenticated-email', email);

            observer.next({
              status: true
            });
          } else if (results.length > 0 && users[results[0]].deleted) {
            window.localStorage.setItem('authenticated-email', email);
            observer.next({
              status: false,
              error: {
                code: 'user-deleted',
                message: 'User Deleted'
              }
            });
          } else if (results.length > 0 && users[results[0]].blocked) {
            observer.next({
              status: false,
              error: {
                code: 'user-blocked',
                message: 'User blocked'
              }
            });
          } else if (results.length > 0 && !users[results[0]].emailVerified) {
            observer.next({
              status: true,
              error: {
                code: 'email-not-verified',
                message: 'Email not verified'
              }
            });
          } else {
            observer.next({
              status: false,
              error: {
                code: 'user-not-found',
                message: 'User not found'
              }
            });
          }

          observer.complete();
        })
        .unsubscribe();
    });
  }

  emailSignUp(email: string, passowrd: string): Observable<ServiceResponse> {
    return new Observable((observer) => {
      this.users
        .subscribe((users: Users) => {
          const results = _.filter(Object.keys(users), function(key) {
            return users[key] && users[key].email
              ? users[key].email.search(
                  window.localStorage.getItem('authenticated-email')
                ) > -1
              : false;
          });

          if (results.length <= 0) {
            observer.next({
              status: true,
              error: 'User created'
            });
          } else {
            observer.next({
              status: false,
              error: 'User exist'
            });
          }

          observer.complete();
        })
        .unsubscribe();
    });
  }

  recoveryPassword(email: string): Observable<ServiceResponse> {
    return new Observable((observer) => {
      observer.next({
        status: true
      });
      observer.complete();
    });
  }

  signOut(): Observable<ServiceResponse> {
    return new Observable((observer) => {
      window.localStorage.removeItem('authenticated-email');

      observer.next({
        status: true
      });
      observer.complete();
    });
  }
}
