import { Injectable } from '@angular/core';
import { StoreService } from 'ng-barn';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

import { LangsService } from '../../../langs/services/langs.service';
import { Accents } from '../../../shared/utils/accents';

import { File } from '../models/file';

export interface ServiceResponse {
  list: File[];
  value: File;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private file: File[] = [];
  private fileDelete: File[] = [];

  constructor(private store: StoreService, private langs: LangsService) {
    const langsNode = this.store.get('langs-node');

    this.file = langsNode[this.langs.currentLang].files || [];
  }

  list(): Observable<File[]> {
    return new Observable((observer) => {
      observer.next(this.file);
      observer.complete();
    });
  }

  listWithPath(path: string): Observable<File[]> {
    return new Observable((observer) => {
      const splitPath: string[] = path.split('|');

      splitPath.shift();

      const cursors = splitPath.map((o) => `['${o}']`).join('');
      const fileList: File[] = this.file;
      let result: File[];
      const updateAction = `result = fileList${cursors}.file`;

      eval(updateAction);

      if (result) {
        observer.next(result);
        observer.complete();
      } else {
        this.filter({ path })
          .subscribe((file: File[]) => {
            observer.next(file);
            observer.complete();
          })
          .unsubscribe();
      }
    });
  }

  item(index): Observable<File> {
    return new Observable((observer) => {
      observer.next(this.file[index]);
      observer.complete();
    });
  }

  itemWithPath(path: string): Observable<File> {
    return new Observable((observer) => {
      const splitPath: string[] = path.split('|');

      splitPath.shift();

      const cursors = splitPath.map((o) => `['${o}']`).join('');
      const fileList: File[] = this.file;
      let result: File;
      const updateAction = `result = fileList${cursors}`;

      eval(updateAction);

      console.log('????', updateAction, result);

      if (result) {
        observer.next(result);
        observer.complete();
      } else {
        console.log('### FILE')
        this.filter({ path })
          .pipe(map((o) => (o.length === 1 ? o[0] : undefined)))
          .subscribe((file: File) => {
            console.log('?????', file);
            observer.next(file);
            observer.complete();
          })
          .unsubscribe();
      }
    });
  }

  filter(query): Observable<File[]> {
    return new Observable((observer) => {
      observer.next(
        _.filter(
          this.file,
          (file: File) =>
            _.filter(Object.keys(query), (key) => {
              const slideValue = new Accents()
                .removeDiacritics(file[key].toString())
                .toLowerCase()
                .replace(/[^\w\s]/gi, '')
                .replace(/[`~!@#$%^&*()_|+\-=÷¿?;°:'",.<>\{\}\[\]\\\/]/gi, '')
                .replace(/ /g, '');
              const filterValue = new Accents()
                .removeDiacritics(query[key].toString())
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

  filterWithPath(path: string, query): Observable<File[]> {
    return new Observable((observer) => {
      const splitPath: string[] = path.split('|');

      splitPath.shift();

      const cursors = splitPath.map((o) => `['${o}']`).join('');
      const fileList: File[] = this.file;
      let result: File[];
      const updateAction = `result = fileList${cursors}.file`;

      eval(updateAction);

      if (result) {
        observer.next(
          _.filter(
            result,
            (file: File) =>
              _.filter(Object.keys(query), (key) => {
                const slideValue = new Accents()
                  .removeDiacritics(file[key].toString())
                  .toLowerCase()
                  .replace(/[^\w\s]/gi, '')
                  .replace(/[`~!@#$%^&*()_|+\-=÷¿?;°:'",.<>\{\}\[\]\\\/]/gi, '')
                  .replace(/ /g, '');
                const filterValue = new Accents()
                  .removeDiacritics(query[key].toString())
                  .toLowerCase()
                  .replace(/[^\w\s]/gi, '')
                  .replace(/[`~!@#$%^&*()_|+\-=÷¿?;°:'",.<>\{\}\[\]\\\/]/gi, '')
                  .replace(/ /g, '');

                  console.log('------------------------->', slideValue,  filterValue)
                return slideValue.search(filterValue) >= 0;
              }).length > 0
          )
        );
        observer.complete();
      } else {
        this.filter({ path })
          .pipe(map((o) => (o.length === 1 ? o[0] : undefined)))
          .subscribe((file: File) => {
            console.log('?????', file);
          })
          .unsubscribe();
      }
    });
  }

  get(index?): Observable<ServiceResponse> {
    return new Observable((observer) => {
      observer.next({
        list: this.file,
        value: index ? this.file[index] : null
      });
      observer.complete();
    });
  }

  set(query, data: File): Observable<ServiceResponse> {
    return new Observable((observer) => {
      this.filter(query)
        .subscribe((file: File[]) => {
          if (file.length > 0) {
            this.file = _.map(this.file, (file: File) => {
              let result: File = file;

              return result;
            });
          }

          observer.next({
            list: this.file,
            value: data
          });
        })
        .unsubscribe();
      observer.complete();
    });
  }

  setWithPath(path: string, value: File): Observable<ServiceResponse> {
    return new Observable((observer) => {
      const splitPath: string[] = path.split('|');

      splitPath.shift();

      const cursors = splitPath.map((o) => `['${o}']`).join('');
      const fileList: File[] = this.file;
      const updateAction = `fileList${cursors} = value`;

      eval(updateAction);

      observer.next({
        list: this.file = fileList,
        value
      });
      observer.complete();
    });
  }

  push(value: File): Observable<ServiceResponse> {
    return new Observable((observer) => {
      this.file.push(value);

      observer.next({
        list: this.file,
        value
      });
      observer.complete();
    });
  }

  pushWithPath(path: string, value: File): Observable<ServiceResponse> {
    return new Observable((observer) => {
      const splitPath: string[] = path.split('|');

      splitPath.shift();

      const cursors = splitPath.map((o) => `['${o}']`).join('');
      const fileList: File[] = this.file;
      const updateAction = `fileList${cursors}.file.push(value)`;

      console.log('>>>>>>>>>>>>> CODE', updateAction);

      console.log('>>>>>>>>>>>> RESULT', fileList);

      eval(updateAction);

      observer.next({
        list: this.file = fileList,
        value
      });
      observer.complete();
    });
  }
}
