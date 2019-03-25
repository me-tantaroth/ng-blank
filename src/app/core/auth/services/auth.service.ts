import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { UserService } from '../../users/services/users.service';

import { User } from '../../users/models/user';

export interface ServiceResponse {
  status: boolean;
  data?: any;
  error?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: Observable<User[]>;

  constructor(private usersService: UserService) {
    this.users = this.usersService.list();
  }

  get authenticated(): Observable<boolean> {
    return new Observable((observer) => {
      this.getUser()
        .subscribe((response) => {
          console.log('Status', response.status);
          if (response.status) {
            console.log(
              response.data,
              response.data.blocked,
              response.data.deleted
            );
            if (
              response.data &&
              (response.data.blocked ||
                response.data.deleted ||
                !response.data.emailVerified)
            ) {
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
        .subscribe((users: User[]) => {
          const results = _.filter(users, function(item) {
            return (
              item.email.indexOf(
                window.localStorage.getItem('authenticated-email')
              ) > -1
            );
          });

          observer.next({
            status: !!results[0],
            data: results[0]
          });
        })
        .unsubscribe();
    });
  }

  emailSignIn(email: string, passowrd: string): Observable<ServiceResponse> {
    return new Observable((observer) => {
      this.users
        .subscribe((users: User[]) => {
          const results = _.filter(users, function(item) {
            return item.email.indexOf(email) > -1;
          });

          if (
            results.length > 0 &&
            !results[0].blocked &&
            !results[0].deleted &&
            results[0].emailVerified
          ) {
            window.localStorage.setItem('authenticated-email', email);

            observer.next({
              status: true
            });
          } else if (results.length > 0 && results[0].deleted) {
            window.localStorage.setItem('authenticated-email', email);
            observer.next({
              status: false,
              error: {
                code: 'user-deleted',
                message: 'User Deleted'
              }
            });
          } else if (results.length > 0 && results[0].blocked) {
            observer.next({
              status: false,
              error: {
                code: 'user-blocked',
                message: 'User blocked'
              }
            });
          } else if (results.length > 0 && !results[0].emailVerified) {
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
        .subscribe((users: User[]) => {
          const results = _.filter(users, function(item) {
            return item.email.indexOf(email) > -1;
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
