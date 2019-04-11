import { Injectable } from '@angular/core';
import { StoreService } from 'ng-barn';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { Config, ConfigService } from '../../../shared/services/config.service';
import { LangsService } from '../../../langs/services/langs.service';

import { Menu, Menus } from '../models/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private rootPath: string;
  private node;
  private menus: Menus;

  constructor(
    private configService: ConfigService,
    private store: StoreService,
    private langs: LangsService
  ) {
    const CONFIG: Config = this.configService.get();
    const NODE = this.store.get('node');
    const NODE_LANGS = NODE.project[CONFIG.project.uid].lang;
    const NODE_MENU =
      NODE_LANGS[document.documentElement.lang] ||
      NODE_LANGS[CONFIG.project.lang].menu.enabled;
    const LANG = NODE_LANGS[document.documentElement.lang]
      ? document.documentElement.lang
      : CONFIG.project.lang;

    this.node = NODE;
    this.rootPath = `|project|${CONFIG.project.uid}|lang|${LANG}|menu`;

    this.menus = NODE_MENU;
  }

  list(path?: string): Observable<Menus> {
    let result: Menus = this.menus;

    if (path) {
      console.log('¡¡¡¡¡>>>>>>', path);
      const node = this.node;

      const splitRootPath: string[] = this.rootPath.split('|');
      const splitPath: string[] = path.split('|');

      splitRootPath.shift();
      splitPath.shift();

      const cursorsRoot = splitRootPath.map((o) => `['${o}']`).join('');
      const cursorsPath = splitPath.map((o) => `['${o}']`).join('');
      const absolutePath = cursorsRoot + cursorsPath;

      const updateAction = `result = node${absolutePath};`;

      console.log('00>', updateAction);
      eval(updateAction);
    }

    return new Observable((observer) => {
      observer.next(result);
      observer.complete();
    });
  }

  getItem(path: string): Observable<Menu> {
    let result: Menu;

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

  setItem(path: string, menu: Menu): Observable<boolean> {
    const node = this.node;

    menu.dbPath = menu.dbPath;

    const splitRootPath: string[] = this.rootPath.split('|');
    const splitPath: string[] = path.split('|');

    splitRootPath.shift();
    splitPath.shift();

    const cursorsRoot = splitRootPath.map((o) => `['${o}']`).join('');
    const cursorsPath = splitPath.map((o) => `['${o}']`).join('');

    let resultValidate;
    let pointer = '';

    _.forEach(splitRootPath, (v2) => {
      pointer += `['${v2}']`;
      eval(`resultValidate = node${pointer}`);
      if (resultValidate === undefined) {
        eval(`node${pointer} = {}`);
      }
    });
    _.forEach(splitPath, (v2) => {
      pointer += `['${v2}']`;
      eval(`resultValidate = node${pointer}`);
      if (resultValidate === undefined) {
        eval(`node${pointer} = {}`);
      }
    });

    const absolutePath = cursorsRoot + cursorsPath;
    const updateAction = `node${absolutePath} = ${JSON.stringify(menu)};`;

    console.log(':::::::', updateAction);
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
