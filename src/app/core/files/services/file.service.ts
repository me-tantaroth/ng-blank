import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { StoreService } from 'ng-barn';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

import { Config, ConfigService } from '../../../shared/services/config.service';

import { File } from '../models/file';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(
    private afs: AngularFirestore,
    private configService: ConfigService,
    private store: StoreService
  ) {}

  list(path: string): Observable<File[]> {
    return this.configService.get().pipe(
      switchMap(
        (config: Config): Observable<File[]> => {
          return this.afs
            .collection<File>(
              `projects/${config.project.uuid}/langs/${
                config.project.lang
              }/modules/drive${path.split('|').join('/')}`
            )
            .valueChanges();
        }
      )
    );
  }

  getItem(path: string): Observable<File> {
    return this.configService
      .get()
      .pipe(
        switchMap(
          (config: Config): Observable<File> =>
            this.afs
              .doc<File>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules/drive${path.split('|').join('/')}`
              )
              .valueChanges()
        )
      );
  }

  setItem(path: string, file: File): Observable<void> {
    return this.configService.get().pipe(
      switchMap(
        (config: Config): Observable<void> => {
          return from(
            this.afs
              .doc<File>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules/drive${path.split('|').join('/')}`
              )
              .set(file)
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
              .doc<File>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules/drive${path.split('|').join('/')}`
              )
              .delete()
          );
        }
      )
    );
  }
}
