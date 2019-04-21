import { makeid } from '../../../shared/utils';

export interface File {
  uuid: string;
  name: string;
  text: string;
  url?: string;
  externalURL: boolean;
  absolutePath?: string;
  customPath?: string;
  backPath: string;
  previewImage?: string;
  type: string; // folder or file type (image/png)
  size?: number;
  lastModifiedDate?: Date;
  root?: boolean;
  user: string; // uuid of user modifier
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
    if (!file.text || file.text === null || file.text === undefined) {
      file.text = file.name;
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
