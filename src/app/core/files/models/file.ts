import { makeid } from '../../../shared/utils';

export interface File {
  name: string;
  path: string;
  backPath: string;
  type: string;
  size?: number;
  lastModifiedDate?: Date;
  file: File[];
  link?: string;
  root?: boolean;
  blocked: boolean;
  deleted: boolean;
  createdAt: Date;
}
export class File {
  constructor(file) {
    return this.format(file);
  }

  format(file) {
    if (!file.type || file.type === null || file.type === undefined) {
      file.type = 'folder';
    }
    if (!file.file || file.file === null || file.file === undefined) {
      file.file = [];
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

export interface Files {
  [key: string]: File;
}
