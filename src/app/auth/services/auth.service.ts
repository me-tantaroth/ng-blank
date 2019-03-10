import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { UsersService } from '../../users/services/users.service';

import { User } from '../../users/models/user';

interface Response {
  status: boolean;
  data?: any;
  error?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [];

  constructor(private usersService: UsersService) {
    this.users = this.usersService.users;
  }

  get authenticated(): Observable<boolean> {
    return new Observable((observer) => {
      observer.next(!!window.localStorage.getItem('authenticated-email'));
      observer.complete();
    });
  }

  getUser(): Observable<Response> {
    const results = _.filter(this.users, function(item) {
      return (
        item.email.indexOf(window.localStorage.getItem('authenticated-email')) >
        -1
      );
    });
    return new Observable((observer) => {
      observer.next({
        status: true,
        data: results[0]
      });
    });
  }

  emailSignIn(email: string, passowrd: string): Observable<Response> {
    const results = _.filter(this.users, function(item) {
      return item.email.indexOf(email) > -1;
    });
    return new Observable((observer) => {
      if (
        results.length > 0 &&
        !results[0].blocked &&
        results[0].emailVerified
      ) {
        window.localStorage.setItem('authenticated-email', email);

        observer.next({
          status: true
        });
      } else if (results[0].blocked) {
        observer.next({
          status: false,
          error: 'User blocked'
        });
      } else if (!results[0].emailVerified) {
        observer.next({
          status: false,
          error: 'email not verified'
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

  emailSignUp(email: string, passowrd: string): Observable<Response> {
    const results = _.filter(this.users, function(item) {
      return item.email.indexOf(email) > -1;
    });
    return new Observable((observer) => {
      if (results.length <= 0) {
        this.emailSignIn(email, passowrd).subscribe((response) => {
          if (response.status) {
            observer.next({
              status: true
            });
          }
        });
      } else {
        observer.next({
          status: false,
          error: 'User exist'
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
