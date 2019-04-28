import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

export interface Project {
  uuid?: string;
  name?: string;
  layout?: string;
  lang?: string;
  icon?: string;
}

export interface Config {
  project?: Project;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private projectsCollection: AngularFirestoreCollection<any>;
  private config: Config;

  constructor(private afs: AngularFirestore) {
    this.projectsCollection = afs.collection<File>(`projects`);
  }

  get(): Observable<Config> {
    return new Observable((observer) => {
      if (this.config.project.uuid) {
        this.projectsCollection
          .doc(this.config.project.uuid || '')
          .valueChanges()
          .pipe(first())
          .subscribe((project: Project) => {
            if (project && Object.keys(project).length > 0) {
              this.config.project.uuid = project.uuid;
              this.config.project.name = project.name;
              this.config.project.layout = project.layout;
              this.config.project.icon = project.icon;

              this.projectsCollection
                .doc(this.config.project.uuid)
                .collection('langs')
                .doc(this.config.project.lang)
                .valueChanges()
                .pipe(first())
                .subscribe((lang) => {
                  if (lang && Object.keys(lang).length > 0) {
                    this.config.project.lang = this.config.project.lang;
                  } else {
                    this.config.project.lang = project.lang;
                  }

                  observer.next(this.config);
                  observer.complete();
                });
            } else {
              this.config.project.uuid = environment.project.uuid;
              this.config.project.name = environment.project.name;
              this.config.project.layout = environment.project.layout;
              this.config.project.lang = environment.project.lang;

              observer.next(this.config);
              observer.complete();
            }
          });
      } else {
        observer.next(this.config);
      }
    });
  }

  set(params: Config): Config {
    return (this.config = { ...this.config, ...params });
  }
}
