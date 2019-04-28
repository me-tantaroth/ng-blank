import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { StoreService } from 'ng-barn';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

import { Config, ConfigService } from '../../../shared/services/config.service';

import { Module } from '../models/module';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {
  constructor(
    private afs: AngularFirestore,
    private configService: ConfigService,
    private store: StoreService
  ) {}

  list(path: string): Observable<Module[]> {
    return this.configService.get().pipe(
      switchMap(
        (config: Config): Observable<Module[]> => {
          return this.afs
            .collection<Module>(
              `projects/${config.project.uuid}/langs/${
                config.project.lang
              }/modules${path.split('|').join('/')}`
            )
            .valueChanges();
        }
      )
    );
  }

  getItem(path: string): Observable<Module> {
    return this.configService
      .get()
      .pipe(
        switchMap(
          (config: Config): Observable<Module> =>
            this.afs
              .doc<Module>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules${path.split('|').join('/')}`
              )
              .valueChanges()
        )
      );
  }

  setItem(path: string, moduleParams: Module): Observable<void> {
    return this.configService.get().pipe(
      switchMap(
        (config: Config): Observable<void> => {
          return from(
            this.afs
              .doc<Module>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules${path.split('|').join('/')}`
              )
              .set(moduleParams)
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
              .doc<Module>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules${path.split('|').join('/')}`
              )
              .delete()
          );
        }
      )
    );
  }
}
