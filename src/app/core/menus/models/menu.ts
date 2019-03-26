import { makeid } from '../../../shared/utils';

export interface Menu {
  uid: string;
  index: number;
  text: string;
  path: string;
  root: boolean;
  backText: string;
  backNode: Menu[];
  submenu?: Menu[];
  redirect?: string;
  blocked: boolean;
  deleted: boolean;
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
    if (!menu.backText || menu.backText === null || menu.backText === undefined) {
      menu.backText = 'Todos';
    }
    if (!menu.submenu || menu.submenu === null || menu.submenu === undefined) {
      menu.submenu = [];
    }
    if (menu.deleted === null || menu.deleted === undefined) {
      menu.deleted = true;
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
