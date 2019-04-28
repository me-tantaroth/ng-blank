import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PermissionService } from '../../core/permissions/services/permission.service';

import { Permission } from '../../core/permissions/models/permission';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {
  constructor(private permissionService: PermissionService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.permissionService.getItem(next.data.route).pipe(
      map((permission: Permission) => {
        return typeof permission === 'object' &&
          Object.keys(permission) &&
          Object.keys(permission).length > 0
          ? true
          : null;
      })
    );
  }
}
