import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { StoreService } from 'ng-barn';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

import { Config, ConfigService } from '../../../shared/services/config.service';

import { Slide } from '../models/slide';

@Injectable({
  providedIn: 'root'
})
export class SlideService {
  constructor(
    private afs: AngularFirestore,
    private configService: ConfigService,
    private store: StoreService
  ) {}

  list(path: string): Observable<Slide[]> {
    return this.configService.get().pipe(
      switchMap(
        (config: Config): Observable<Slide[]> => {
          return this.afs
            .collection<Slide>(
              `projects/${config.project.uuid}/langs/${
                config.project.lang
              }/modules/slide${path.split('|').join('/')}`
            )
            .valueChanges();
        }
      )
    );
  }

  getItem(path: string): Observable<Slide> {
    return this.configService
      .get()
      .pipe(
        switchMap(
          (config: Config): Observable<Slide> =>
            this.afs
              .doc<Slide>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules/slide${path.split('|').join('/')}`
              )
              .valueChanges()
        )
      );
  }

  setItem(path: string, slide: Slide): Observable<void> {
    return this.configService.get().pipe(
      switchMap(
        (config: Config): Observable<void> => {
          return from(
            this.afs
              .doc<Slide>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules/slide${path.split('|').join('/')}`
              )
              .set(slide)
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
              .doc<Slide>(
                `projects/${config.project.uuid}/langs/${
                  config.project.lang
                }/modules/slide${path.split('|').join('/')}`
              )
              .delete()
          );
        }
      )
    );
  }
}
