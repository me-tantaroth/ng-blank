import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { StoreService } from 'ng-barn';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

import { Config, ConfigService } from '../../../shared/services/config.service';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private afs: AngularFirestore,
    private configService: ConfigService,
    private store: StoreService
  ) {}

  list(path: string): Observable<User[]> {
    return this.configService.get().pipe(
      switchMap(
        (config: Config): Observable<User[]> => {
          return this.afs
            .collection<User>(
              `projects/${config.project.uuid}/langs/${
                config.project.lang
              }/modules/user${path.split('|').join('/')}`
            )
            .valueChanges();
        }
      )
    );
  }

  getItem(path: string): Observable<User> {
    return this.configService
      .get()
      .pipe(
        switchMap(
          (config: Config): Observable<User> =>
            this.afs
              .doc<User>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules/user${path.split('|').join('/')}`
              )
              .valueChanges()
        )
      );
  }

  setItem(path: string, user: User): Observable<void> {
    return this.configService.get().pipe(
      switchMap(
        (config: Config): Observable<void> => {
          return from(
            this.afs
              .doc<User>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules/user${path.split('|').join('/')}`
              )
              .set(user)
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
              .doc<User>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules/user${path.split('|').join('/')}`
              )
              .delete()
          );
        }
      )
    );
  }
}
