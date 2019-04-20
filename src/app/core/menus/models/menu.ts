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
