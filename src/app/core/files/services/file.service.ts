import { Injectable } from '@angular/core';
import { StoreService } from 'ng-barn';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { Config, ConfigService } from '../../../shared/services/config.service';
import { LangsService } from '../../../langs/services/langs.service';

import { File, Files } from '../models/file';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private rootPath: string;
  private node;
  private files: Files;


  constructor(
    private configService: ConfigService,
    private store: StoreService,
    private langs: LangsService
  ) {
    const CONFIG: Config = this.configService.get();
    const NODE = this.store.get('node');
    const NODE_LANGS = NODE[CONFIG.project.uid].lang;
    const NODE_FILE =
      NODE_LANGS[document.documentElement.lang] ||
      NODE_LANGS[CONFIG.project.lang].file.enabled;
    const LANG = NODE_LANGS[document.documentElement.lang]
      ? document.documentElement.lang
      : CONFIG.project.lang;

    this.node = NODE;
    this.rootPath = `|${CONFIG.project.uid}|lang|${LANG}|file`;

    this.files = NODE_FILE;
  }

  list(path?: string): Observable<Files> {
    let result: Files = this.files;

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

  getItem(path: string): Observable<File> {
    let result: File;

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

  setItem(path: string, file: File): Observable<boolean> {
    const node = this.node;

    file.dbPath = file.dbPath;

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
    const updateAction = `node${absolutePath} = ${JSON.stringify(file)};`;

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
