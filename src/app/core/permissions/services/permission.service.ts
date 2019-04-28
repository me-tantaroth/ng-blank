import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { StoreService } from 'ng-barn';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

import { Config, ConfigService } from '../../../shared/services/config.service';

import { Permission } from '../models/permission';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  constructor(
    private afs: AngularFirestore,
    private configService: ConfigService,
    private store: StoreService
  ) {}

  list(path: string): Observable<Permission[]> {
    return this.configService.get().pipe(
      switchMap(
        (config: Config): Observable<Permission[]> => {
          return this.afs
            .collection<Permission>(
              `projects/${config.project.uuid}/langs/${
                config.project.lang
              }/modules/permission${path.split('|').join('/')}`
            )
            .valueChanges();
        }
      )
    );
  }

  getItem(path: string): Observable<Permission> {
    return this.configService
      .get()
      .pipe(
        switchMap(
          (config: Config): Observable<Permission> =>
            this.afs
              .doc<Permission>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules/permission${path.split('|').join('/')}`
              )
              .valueChanges()
        )
      );
  }

  setItem(path: string, permission: Permission): Observable<void> {
    return this.configService.get().pipe(
      switchMap(
        (config: Config): Observable<void> => {
          return from(
            this.afs
              .doc<Permission>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules/permission${path.split('|').join('/')}`
              )
              .set(permission)
          );
        }
      )
    );
  }

  removeItem(path: string): Observable<void> {
    return this.configService.get().pipe(
      switchMap(
        (config: Config): Observable<void> => {
          return from(
            this.afs
              .doc<Permission>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules/permission${path.split('|').join('/')}`
              )
              .delete()
          );
        }
      )
    );
  }
}
