import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

export interface Project {
  uid: string;
  name: string
}

export interface Config {
  project: Project;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: Config;

  constructor() {}

  get(): Config {
    return { ...environment, ...this.config };
  }

  set(params: Config): Config {
    return (this.config = { ...environment, ...params });
  }
}
