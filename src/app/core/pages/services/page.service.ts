import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { StoreService } from 'ng-barn';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

import { Config, ConfigService } from '../../../shared/services/config.service';

import { Page } from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  constructor(
    private afs: AngularFirestore,
    private configService: ConfigService,
    private store: StoreService
  ) {}

  list(path: string): Observable<Page[]> {
    return this.configService.get().pipe(
      switchMap(
        (config: Config): Observable<Page[]> => {
          return this.afs
            .collection<Page>(
              `projects/${config.project.uuid}/langs/${
                config.project.lang
              }/modules/page${path.split('|').join('/')}`
            )
            .valueChanges();
        }
      )
    );
  }

  getItem(path: string): Observable<Page> {
    return this.configService
      .get()
      .pipe(
        switchMap(
          (config: Config): Observable<Page> =>
            this.afs
              .doc<Page>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules/page${path.split('|').join('/')}`
              )
              .valueChanges()
        )
      );
  }

  setItem(path: string, page: Page): Observable<void> {
    return this.configService.get().pipe(
      switchMap(
        (config: Config): Observable<void> => {
          return from(
            this.afs
              .doc<Page>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules/page${path.split('|').join('/')}`
              )
              .set(page)
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
              .doc<Page>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules/page${path.split('|').join('/')}`
              )
              .delete()
          );
        }
      )
    );
  }
}
