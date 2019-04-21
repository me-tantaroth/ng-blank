import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, of } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { makeid } from '../../shared/utils';

export interface FileUploaded {
  percent?: Observable<number>;
  downloadURL?: Observable<string>;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: AngularFireStorage;
  downloadURL: Observable<string>;

  constructor(private _storage: AngularFireStorage) {}

  uploadFile(file): Observable<FileUploaded> {
    const fileSplit = file.name.split('.');
    const storageRef = this._storage.ref(
      'drive/' + file.uuid + '.' + fileSplit[fileSplit.length - 1]
    );
    const task = storageRef.put(file);

    return new Observable((observer) => {
      observer.next({
        downloadURL: of(null),
        percent: task.percentageChanges()
      });

      task
        .snapshotChanges()
        .pipe(
          finalize(() =>
            storageRef
              .getDownloadURL()
              .pipe(first())
              .subscribe((url) => {
                observer.next({
                  downloadURL: of(url),
                  percent: of(100)
                });

                observer.complete();
              })
          )
        )
        .subscribe();
    });
  }
}
