import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignInGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.currentUser().pipe(
      map((u) => {
        if (!u || (!!u && !u.emailVerified && u.deleted && u.blocked)) {
          this.router.navigate(['/not-found']);
        }
        return !!u && u.emailVerified && !u.deleted && !u.blocked;
      })
    );
  }
}
