import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Response {
  status: boolean;
  data?: any;
  error?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  get authenticated(): Observable<boolean> {
    const authEmailLocal = window.localStorage.getItem('authenticated-email');
    return new Observable(
      observer => {
        observer.next(!!authEmailLocal);
        observer.complete();
      }
    );
  }

  emailSignIn(email: string, passowrd: string): Observable<Response> {
    return new Observable(
      observer => {
        window.localStorage.setItem('authenticated-email', email);

        observer.next({
          status: true
        });
        observer.complete();
      }
    );
  }

  signOut(): Observable<Response> {
    return new Observable(
      observer => {
        window.localStorage.removeItem('authenticated-email');

        observer.next({
          status: true
        });
        observer.complete();
      }
    );
  }
}
