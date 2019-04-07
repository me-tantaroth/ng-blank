import { makeid } from '../../../shared/utils';

export interface Menu {
  text: string;
  path: string;
  backPath: string;
  menu: Menu[];
  link: string;
  root?: boolean;
  blocked: boolean;
  deleted: boolean;
  createdAt: Date;
}
export class Menu {
  constructor(menu) {
    return this.format(menu);
  }

  format(menu) {
    if (!menu.menu || menu.menu === null || menu.menu === undefined) {
      menu.menu = [];
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

export interface Menus {
  [key: string]: Menu;
}
