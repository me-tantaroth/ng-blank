import { makeid } from '../../../shared/utils';

export interface Menus {
  [key: string]: Menu;
}

export interface Menu {
  uid: string;
  title: string;
  currentPath: string;
  backPath: string;
  enabled?: Menus;
  url: string;
  externalURL: boolean;
  root?: boolean;
  dbPath?: string;
  blocked: boolean;
  deleted: boolean;
  deletedCount: number;
  createdAt: Date;
}
export class Menu {
  constructor(menu) {
    return this.format(menu);
  }

  format(menu) {
    if (!menu.uid || menu.uid === null || menu.uid === undefined) {
      menu.uid = 'menu-' + makeid(15);
    }
    if (!menu.enabled || menu.enabled === null || menu.enabled === undefined) {
      menu.enabled = {};
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
