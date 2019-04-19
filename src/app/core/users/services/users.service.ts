import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { StoreService } from 'ng-barn';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { Config, ConfigService } from '../../../shared/services/config.service';
import { LangsService } from '../../../langs/services/langs.service';

import { User, Users } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection: AngularFirestoreCollection<User>;
  private rootPath: string;
  private node;
  private users: Users;

  constructor(
    private afs: AngularFirestore,
    private configService: ConfigService,
    private store: StoreService,
    private langs: LangsService
  ) {
    // const CONFIG: Config = this.configService.get();
    // const NODE = this.store.get('node');
    // const NODE_LANGS = NODE.project[CONFIG.project.uid].lang;
    // const NODE_USERS =
    //   NODE_LANGS[document.documentElement.lang] ||
    //   NODE_LANGS[CONFIG.project.lang].modules.user.enabled.list;
    // const LANG = NODE_LANGS[document.documentElement.lang]
    //   ? document.documentElement.lang
    //   : CONFIG.project.lang;

    // this.node = NODE;
    // this.rootPath = `|project|${CONFIG.project.uid}|lang|${LANG}|user`;

    this.users = {};

    // console.log('¡¡¡>>>>', this.rootPath.split('|').join('/'))
    this.usersCollection = this.afs.collection<User>('/project/black-fire/lang');
  }

  list(path?: string): Observable<Users> {
    let result: Users = this.users;

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

  getItem(path: string): Observable<User> {
    let result: User;

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

  setItem(path: string, user: User): Observable<boolean> {
    const node = this.node;

    user.dbPath = user.dbPath;

    const splitRootPath: string[] = this.rootPath.split('|');
    const splitPath: string[] = path.split('|');

    splitRootPath.shift();
    splitPath.shift();

    const firePath = splitPath.join('/');
    console.log('>>>>>', this.rootPath.split('|').join('/'), firePath);
    const cursorsRoot = splitRootPath.map((o) => `['${o}']`).join('');
    const cursorsPath = splitPath.map((o) => `['${o}']`).join('');
    const absolutePath = cursorsRoot + cursorsPath;
    const updateAction = `node${absolutePath} = ${JSON.stringify(user)};`;

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
