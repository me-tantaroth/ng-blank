import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';

import { UserService } from '../../../core/users/services/user.service';

import { User } from '../../../core/users/models/user';
import { map } from 'rxjs/operators';

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
  private authResponse: Subject<ServiceResponse> = new Subject<
    ServiceResponse
  >();

  constructor(
    public afAuth: AngularFireAuth,
    private usersService: UserService
  ) {
    this.users = this.usersService.list('|list');
  }

  get authenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(map((u) => !!u));
  }

  currentUser(): Observable<User> {
    return this.afAuth.authState.pipe(map((u) => new User(u)));
  }

  sendEmailVerification(): Observable<ServiceResponse> {
    this.afAuth.auth.currentUser
      .sendEmailVerification()
      .then(() =>
        this.authResponse.next({
          status: true
        })
      )
      .catch((err) =>
        this.authResponse.next({
          status: false,
          error: err
        })
      );

    return this.authResponse.asObservable();
  }

  emailSignIn(email: string, passowrd: string): Observable<ServiceResponse> {
    this.afAuth.auth
      .signInWithEmailAndPassword(email, passowrd)
      .then((snap) => {
        if (snap) {
          if (snap.user) {
            const user: User = new User(snap.user);

            if (user.emailVerified) {
              window.localStorage.setItem('authenticated-email', email);

              this.authResponse.next({
                status: true,
                data: user
              });
            } else if (user.deleted) {
              this.authResponse.next({
                status: false,
                error: {
                  code: 'user-deleted',
                  message: 'User Deleted'
                }
              });
            } else if (user.blocked) {
              this.authResponse.next({
                status: false,
                error: {
                  code: 'user-blocked',
                  message: 'User blocked'
                }
              });
            } else {
              this.authResponse.next({
                status: false,
                error: {
                  code: 'user-not-verified',
                  message: 'User not verified'
                }
              });

              this.sendEmailVerification();
            }
          }
        } else {
          this.authResponse.next({
            status: false,
            error: {
              code: 'user-not-found',
              message: 'User not found'
            }
          });
        }
      })
      .catch((err) => {
        this.authResponse.next({
          status: false,
          error: err
        });
      });

    return this.authResponse.asObservable();
  }

  emailSignUp(email: string, passowrd: string): Observable<ServiceResponse> {
    this.afAuth.auth
      .createUserWithEmailAndPassword(email, passowrd)
      .then((snap) => {
        if (snap) {
          if (snap.user) {
            const user: User = new User(snap.user);

            this.authResponse.next({
              status: true,
              data: new User(user)
            });

            this.sendEmailVerification();
          }
        } else {
          this.authResponse.next({
            status: false,
            error: 'User not exist'
          });
        }
      })
      .catch((err) => {
        this.authResponse.next({
          status: false,
          error: err
        });
      });
    return this.authResponse.asObservable();
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
    window.localStorage.removeItem('authenticated-email');

    return new Observable((observer) => {
      this.afAuth.auth.signOut().then(() => {
        observer.next({
          status: true
        });
        observer.complete();
      });
    });
  }
}
