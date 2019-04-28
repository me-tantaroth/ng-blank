import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';

import { StoreService } from 'ng-barn';
import { AuthService } from '../../auth/services/auth.service';
import { UsersService } from '../../users/services/users.service';
import { TdLoadingService } from '../../../covalent.module';

import { User } from '../../users/models/user';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(
    private store: StoreService,
    private auth: AuthService,
    private usersService: UsersService,
    private router: Router,
    private _tdLoadingService: TdLoadingService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.auth.currentUser().pipe(
      switchMap(
        (user: User): Observable<boolean> => {
          const route_data: string[] =
            next.data.route &&
            typeof next.data.route === 'object' &&
            next.data.route.length &&
            next.data.route.length > 0
              ? next.data.route
              : [];

          return new Observable((observer) => {
            if (route_data.length > 0) {
              for (const path of route_data) {
                this.store.set(
                  {
                    path: '|' + user.uid
                  },
                  'currentUserPermissions'
                );

                this.usersService
                  .getItem('|' + user.uid)
                  .pipe(first())
                  .subscribe((userPermissions: User) => {
                    const userVerified: boolean =
                      user &&
                      user.emailVerified &&
                      userPermissions &&
                      !userPermissions.deleted &&
                      !userPermissions.blocked &&
                      typeof userPermissions === 'object' &&
                      Object.keys(userPermissions) &&
                      Object.keys(userPermissions).length > 0;

                    if (!userVerified) {
                      this.router.navigate(['/not-found']);
                    }

                    observer.next(userVerified ? true : null);
                    observer.complete();
                  });
              }
            } else {
              this.router.navigate(['/not-found']);
            }
          });
        }
      )
    );
  }
}
