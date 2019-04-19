import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { StoreService } from 'ng-barn';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { Config, ConfigService } from '../../../shared/services/config.service';
import { LangsService } from '../../../langs/services/langs.service';

import { Page, Pages } from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private pagesCollection: AngularFirestoreCollection<Page>;
  private rootPath: string;
  private node;
  private pages: Pages;

  constructor(
    private afs: AngularFirestore,
    private configService: ConfigService,
    private store: StoreService,
    private langs: LangsService
  ) {
    // const CONFIG: Config = this.configService.get();
    // const NODE = this.store.get('node');
    // CONFIG.project.uid;


    // const NODE_LANGS = NODE.project[CONFIG.project.uid].lang;
    // const NODE_PAGES =
    //   NODE_LANGS[document.documentElement.lang] ||
    //   NODE_LANGS[CONFIG.project.lang].modules.page.enabled.list;
    // const LANG = NODE_LANGS[document.documentElement.lang]
    //   ? document.documentElement.lang
    //   : CONFIG.project.lang;

    // this.node = NODE;
    // this.rootPath = `|project|${CONFIG.project.uid}|lang|${LANG}|page`;

    this.pages = {};
  }

  list(path?: string): Observable<Pages> {
    let result: Pages = this.pages;

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

  getItem(path: string): Observable<Page> {
    let result: Page;

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

  setItem(path: string, page: Page): Observable<boolean> {
    const node = this.node;

    page.dbPath = page.dbPath;

    const splitRootPath: string[] = this.rootPath.split('|');
    const splitPath: string[] = path.split('|');

    splitRootPath.shift();
    splitPath.shift();

    const cursorsRoot = splitRootPath.map((o) => `['${o}']`).join('');
    const cursorsPath = splitPath.map((o) => `['${o}']`).join('');
    const absolutePath = cursorsRoot + cursorsPath;
    const updateAction = `node${absolutePath} = ${JSON.stringify(page)};`;

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
