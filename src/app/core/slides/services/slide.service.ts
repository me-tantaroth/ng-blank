import { Injectable } from '@angular/core';
import { StoreService } from 'ng-barn';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { Config, ConfigService } from '../../../shared/services/config.service';
import { LangsService } from '../../../langs/services/langs.service';

import { Slide, Slides } from '../models/slide';

@Injectable({
  providedIn: 'root'
})
export class SlideService {
  private rootPath: string;
  private node;
  private slides: Slides;

  constructor(
    private configService: ConfigService,
    private store: StoreService,
    private langs: LangsService
  ) {
    const CONFIG: Config = this.configService.get();
    const NODE = this.store.get('node');
    const NODE_LANGS = NODE[CONFIG.project.uid].lang;
    const NODE_SLIDES =
      NODE_LANGS[document.documentElement.lang] ||
      NODE_LANGS[CONFIG.project.lang].slide.enabled;
    const LANG = NODE_LANGS[document.documentElement.lang]
      ? document.documentElement.lang
      : CONFIG.project.lang;

    this.node = NODE;
    this.rootPath = `|${CONFIG.project.uid}|lang|${LANG}|slide`;

    this.slides = NODE_SLIDES;
  }

  list(path?: string): Observable<Slides> {
    let result: Slides = this.slides;

    if (path) {
      const node = this.node;

      const splitRootPath: string[] = this.rootPath.split('|');
      const splitPath: string[] = path.split('|');

      splitRootPath.shift();
      splitPath.shift();

      const cursorsRoot = splitRootPath.map((o) => `['${o}']`).join('');
      const cursorsPath = splitPath.map((o) => `['${o}']`).join('');
      const absolutePath = cursorsRoot + cursorsPath;

      const updateAction = `result = node${absolutePath};`;

      eval(updateAction);
    }

    return new Observable((observer) => {
      observer.next(result);
      observer.complete();
    });
  }

  getItem(path: string): Observable<Slide> {
    let result: Slide;

    const node = this.node;

    const splitRootPath: string[] = this.rootPath.split('|');
    const splitPath: string[] = path.split('|');

    splitRootPath.shift();
    splitPath.shift();

    const cursorsRoot = splitRootPath.map((o) => `['${o}']`).join('');
    const cursorsPath = splitPath.map((o) => `['${o}']`).join('');
    const absolutePath = cursorsRoot + cursorsPath;
    const updateAction = `result = node${absolutePath};`;

    eval(updateAction);

    return new Observable((observer) => {
      observer.next(result);
      observer.complete();
    });
  }

  setItem(path: string, slide: Slide): Observable<boolean> {
    const node = this.node;

    slide.dbPath = slide.dbPath;

    const splitRootPath: string[] = this.rootPath.split('|');
    const splitPath: string[] = path.split('|');

    splitRootPath.shift();
    splitPath.shift();

    const cursorsRoot = splitRootPath.map((o) => `['${o}']`).join('');
    const cursorsPath = splitPath.map((o) => `['${o}']`).join('');
    const absolutePath = cursorsRoot + cursorsPath;
    const updateAction = `node${absolutePath} = ${JSON.stringify(slide)};`;

    eval(updateAction);

    return new Observable((observer) => {
      observer.next(true);
      observer.complete();
    });
  }

  removeItem(path: string): Observable<boolean> {
    const node = this.node;

    const splitRootPath: string[] = this.rootPath.split('|');
    const splitPath: string[] = path.split('|');

    splitRootPath.shift();
    splitPath.shift();

    const cursorsRoot = splitRootPath.map((o) => `['${o}']`).join('');
    const cursorsPath = splitPath.map((o) => `['${o}']`).join('');
    const absolutePath = cursorsRoot + cursorsPath;

    const updateAction = `delete node${absolutePath};`;

    eval(updateAction);

    return new Observable((observer) => {
      observer.next(true);
      observer.complete();
    });
  }

}
