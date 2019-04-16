
import * as firebase from 'firebase/app';

import { makeid } from '../../../shared/utils';

export interface Files {
  [key: string]: File;
}

export interface File {
  uid: string;
  title: string;
  currentPath: string;
  backPath: string;
  dbPath?: string;
  type: string;
  size?: number;
  lastModifiedDate?: Date;
  enabled?: Files;
  url?: string;
  externalURL: boolean;
  root?: boolean;
  blocked: boolean;
  deleted: boolean;
  deletedCount: number;
  createdAt: firebase.firestore.FieldValue;
}
export class File {
  constructor(file) {
    return this.format(file);
  }

  format(file) {
    if (!file.uid || file.uid === null || file.uid === undefined) {
      file.uid = 'file-' + makeid(15);
    }
    if (!file.type || file.type === null || file.type === undefined) {
      file.type = 'folder';
    }
    if (!file.enabled || file.enabled === null || file.enabled === undefined) {
      file.enabled = {};
    }
    if (
      !file.createdAt ||
      file.createdAt === null ||
      file.createdAt === undefined
    ) {
      file.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    }
    return file;
  }
}
