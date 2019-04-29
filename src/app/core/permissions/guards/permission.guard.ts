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
import { UserService } from '../../users/services/user.service';

import { User } from '../../users/models/user';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(
    private store: StoreService,
    private auth: AuthService,
    private userService: UserService,
    private router: Router
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
        (user: any): Observable<boolean> => {
          const route_data: string[] =
            next.data.route &&
            typeof next.data.route === 'object' &&
            next.data.route.length &&
            next.data.route.length > 0
              ? next.data.route
              : [];

          return new Observable((observer) => {
            if (route_data.length > 0) {
              this.userService
                .getItem('|list|' + user.uid)
                .pipe(first())
                .subscribe((userPermissions: User) => {
                  if (
                    userPermissions &&
                    Object.keys(userPermissions) &&
                    Object.keys(userPermissions).length > 0
                  ) {
                    let routeValid: boolean;
                    let userValid: User;

                    for (const path of route_data) {
                      const userVerified: boolean =
                        user &&
                        user.emailVerified &&
                        userPermissions &&
                        !userPermissions.deleted &&
                        !userPermissions.blocked &&
                        typeof userPermissions === 'object' &&
                        Object.keys(userPermissions) &&
                        Object.keys(userPermissions).length > 0 &&
                        JSON.stringify(userPermissions.permissions).search(
                          path
                        ) >= 0 &&
                        userPermissions.permissions[path];

                      if (userVerified) {
                        userValid = userPermissions;
                        routeValid = true;
                      }
                    }
                    if (routeValid) {
                      this.store.set(
                        {
                          path: '|list|' + user.uid
                        },
                        'currentUserPermissions'
                      );

                      observer.next(routeValid ? true : null);
                      observer.complete();
                    } else {
                      this.router.navigate(['/denied-page']);
                    }
                  } else {
                    this.router.navigate(['/denied-page']);
                  }
                });
            } else {
              this.router.navigate(['/denied-page']);
            }
          });
        }
      )
    );
  }
}
