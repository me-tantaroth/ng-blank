import { Injectable } from '@angular/core';
import { StoreService } from 'ng-barn';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { LangsService } from '../../../langs/services/langs.service';

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

  item(index): Observable<Slide> {
    return new Observable((observer) => {
      observer.next(this.slides[index]);
      observer.complete();
    });
  }

  filter(key, validate): Observable<Slide> {
    return new Observable((observer) => {
      console.log(_.filter(this.slides, (o) => o[key] === validate));
      observer.next(this.slides[0]);
      observer.complete();
    });
  }

  get(index?): Observable<ServiceResponse> {
    return new Observable((observer) => {
      observer.next({
        list: this.slides,
        index: index || null,
        value: index ? this.slides[index] : null
      });
      observer.complete();
    });
  }

  set(index, value: Slide): Observable<ServiceResponse> {
    return new Observable((observer) => {
      observer.next({
        list: this.slides,
        index: index,
        value: this.slides[index] = value
      });
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
