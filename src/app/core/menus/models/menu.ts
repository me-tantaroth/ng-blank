import { makeid } from '../../../shared/utils';

export interface Menu {
  uid: string;
  index: number;
  text: string;
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
    if (menu.blocked === null || menu.blocked === undefined) {
      menu.blocked = true;
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
