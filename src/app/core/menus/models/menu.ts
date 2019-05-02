import { makeid } from '../../../shared/utils';

export interface Menu {
  uuid: string;
  name: string;
  text: string;
  url: string;
  externalURL: boolean;
  absolutePath: string;
  customPath?: string;
  backPath: string;
  root?: boolean;
  user: string; // uuid of user modifier
  blocked: boolean;
  deleted: boolean;
  deleteCount: number;
  createdAt: Date;
}
export class Menu {
  constructor(menu = {}) {
    return this.format(menu);
  }

  format(menu) {
    if (!menu.text || menu.text === null || menu.text === undefined) {
      menu.text = menu.name;
    }
    if (
      !menu.createdAt ||
      menu.createdAt === null ||
      menu.createdAt === undefined
    ) {
      menu.createdAt = new Date();
    }
    return menu;
  }
}
