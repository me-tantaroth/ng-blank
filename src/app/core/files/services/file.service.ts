import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { StoreService } from 'ng-barn';
import { Observable, Subject, of } from 'rxjs';
import * as _ from 'lodash';

import { Config, ConfigService } from '../../../shared/services/config.service';
import { LangsService } from '../../../langs/services/langs.service';

import { File, Files } from '../models/file';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private fileCollection: AngularFirestoreCollection<File>;
  private fileList: Observable<File[]> = new Observable<File[]>();
  private rootPath: string;
  private node;
  private files: Files;

  constructor(
    private afs: AngularFirestore,
    private configService: ConfigService,
    private store: StoreService,
    private langs: LangsService
  ) {
    const CONFIG: Config = this.configService.get();
    const NODE = this.store.get('node');
    const NODE_LANGS = NODE.project[CONFIG.project.uid].lang;
    const NODE_FILE = (
      NODE_LANGS[document.documentElement.lang] ||
      NODE_LANGS[CONFIG.project.lang]
    ).modules.file;
    const LANG = NODE_LANGS[document.documentElement.lang]
      ? document.documentElement.lang
      : CONFIG.project.lang;

    this.node = NODE;
    this.rootPath = `|project|${CONFIG.project.uid}|lang|${LANG}|modules|file`;

    this.files = NODE_FILE;
  }

  list(path: string): Observable<File[]> {
    const splitRootPath: string[] = this.rootPath.split('|');
    const splitPath: string[] = path.split('|');
    const fbPath = splitRootPath.join('/') + splitPath.join('/');

    console.log('###### LIST', fbPath);

    try {
      this.fileCollection = this.afs.collection<File>(fbPath);
      this.fileList = this.fileCollection.valueChanges();
    } catch (err) {
      this.fileList = of(null);
    }

    return this.fileList;
  }

  getItem(path: string): Observable<File> {
    const splitRootPath: string[] = this.rootPath.split('|');
    const splitPath: string[] = path.split('|');
    const fbPath = splitRootPath.join('/') + splitPath.join('/');
    console.log('#### GET ITEM', fbPath);

    return this.afs.doc<File>(fbPath).valueChanges();
  }

  setItem(path: string, file: File): Observable<boolean> {
    const node = this.node;

    file.dbPath = file.dbPath;

    const splitRootPath: string[] = this.rootPath.split('|');
    const splitPath: string[] = path.split('|');
    const fbPath = splitRootPath.join('/') + splitPath.join('/');

    console.log('###### SET', fbPath, file);

    return new Observable((observer) => {
      this.afs
        .doc<File>(fbPath)
        .set(file, { merge: true })
        .then(() => {
          // this.afs
          //   .doc(fbPath + '/list/enabled')
          //   .set({ name: 'Habilitado' }, { merge: true })
          //   .then(() => {
          //     console.log('>>> PATH', fbPath + '/list/enabled');
          //     observer.next(true);
          //   });
            observer.next(true);
        })
        .catch(() => observer.next(false));
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
