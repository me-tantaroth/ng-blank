import { Injectable } from '@angular/core';
import { StoreService } from 'ng-barn';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { LangsService } from '../../../langs/services/langs.service';
import { Accents } from '../../../shared/utils/accents';

import { Slide } from '../models/slide';

export interface ServiceResponse {
  list: Slide[];
  index: number;
  value: Slide;
}

@Injectable({
  providedIn: 'root'
})
export class SlideService {
  private slides: Slide[] = [];

  constructor(private store: StoreService, private langs: LangsService) {
    const langsNode = this.store.get('langs-node');

    this.slides = langsNode[this.langs.currentLang].slides || [];
  }

  list(): Observable<Slide[]> {
    return new Observable((observer) => {
      observer.next(this.slides);
      observer.complete();
    });
  }

  item(uid): Observable<Slide> {
    return new Observable((observer) => {
      observer.next(this.slides[uid]);
      observer.complete();
    });
  }

  filter(query): Observable<Slide[]> {
    return new Observable((observer) => {
      observer.next(
        _.filter(
          this.slides,
          (slide: Slide) =>
            _.filter(Object.keys(query), (key) => {
              const slideValue = new Accents()
                .removeDiacritics(slide[key])
                .toLowerCase()
                .replace(/[^\w\s]/gi, '')
                .replace(/[`~!@#$%^&*()_|+\-=÷¿?;°:'",.<>\{\}\[\]\\\/]/gi, '')
                .replace(/ /g, '');
              const filterValue = new Accents()
                .removeDiacritics(query[key])
                .toLowerCase()
                .replace(/[^\w\s]/gi, '')
                .replace(/[`~!@#$%^&*()_|+\-=÷¿?;°:'",.<>\{\}\[\]\\\/]/gi, '')
                .replace(/ /g, '');

              return slideValue.search(filterValue) >= 0;
            }).length > 0
        )
      );
      observer.complete();
    });
  }

  get(uid?): Observable<ServiceResponse> {
    return new Observable((observer) => {
      observer.next({
        list: this.slides,
        index: uid || null,
        value: uid ? this.slides[uid] : null
      });
      observer.complete();
    });
  }

  set(query, data: Slide): Observable<ServiceResponse> {
    return new Observable((observer) => {
      this.filter(query)
        .subscribe((slides: Slide[]) => {
          if (slides.length > 0) {
            this.slides = _.map(this.slides, (slide: Slide) => {
              let result: Slide = slide;

              if (slide.uid === data.uid) {
                result = data;
              }

              return result;
            });
          }

          observer.next({
            list: this.slides,
            index: data.index,
            value: data
          });
        })
        .unsubscribe();
      observer.complete();
    });
  }

  push(value: Slide): Observable<ServiceResponse> {
    return new Observable((observer) => {
      this.slides.push(value);

      observer.next({
        list: this.slides,
        index: this.slides.length - 1,
        value
      });
      observer.complete();
    });
  }
}
