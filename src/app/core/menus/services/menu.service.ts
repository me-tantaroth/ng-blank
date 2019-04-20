import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { StoreService } from 'ng-barn';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

import { Config, ConfigService } from '../../../shared/services/config.service';

import { Menu } from '../models/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(
    private afs: AngularFirestore,
    private configService: ConfigService,
    private store: StoreService
  ) {}

  list(path: string): Observable<Menu[]> {
    return this.configService.get().pipe(
      switchMap(
        (config: Config): Observable<Menu[]> => {
          return this.afs
            .collection<Menu>(
              `projects/${config.project.uuid}/langs/${
                config.project.lang
              }/modules/menu${path.split('|').join('/')}`
            )
            .valueChanges();
        }
      )
    );
  }

  getItem(path: string): Observable<Menu> {
    return this.configService
      .get()
      .pipe(
        switchMap(
          (config: Config): Observable<Menu> =>
            this.afs
              .doc<Menu>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules/menu${path.split('|').join('/')}`
              )
              .valueChanges()
        )
      );
  }

  setItem(path: string, menu: Menu): Observable<void> {
    return this.configService.get().pipe(
      switchMap(
        (config: Config): Observable<void> => {
          return from(
            this.afs
              .doc<Menu>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules/menu${path.split('|').join('/')}`
              )
              .set(menu)
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
              .doc<Menu>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules/menu${path.split('|').join('/')}`
              )
              .delete()
          );
        }
      )
    );
  }
}
