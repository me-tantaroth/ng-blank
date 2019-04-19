
import * as firebase from 'firebase/app';

import { makeid } from '../../../shared/utils';

export interface Files {
  [key: string]: File;
}

export interface File {
  uuid: string;
  name: string;
  text: string;
  backPath: string;
  absolutePath?: string;
  customPath?: string;
  type: string;
  size?: number;
  lastModifiedDate?: Date;
  url?: string;
  previewImage?: string;
  externalURL: boolean;
  root?: boolean;
  user: string;
  blocked: boolean;
  deleted: boolean;
  deleteCount: number;
  createdAt: Date;
}
export class File {
  constructor(file) {
    return this.format(file);
  }

  format(file) {
    if (!file.uuid || file.uuid === null || file.uuid === undefined) {
      file.uuid = 'file-' + makeid(15);
    }
    if (!file.type || file.type === null || file.type === undefined) {
      file.type = 'folder';
    }
    if (
      !file.createdAt ||
      file.createdAt === null ||
      file.createdAt === undefined
    ) {
      file.createdAt = new Date();
    }
    return file;
  }
}
