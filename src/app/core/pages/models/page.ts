import { environment } from '../../../../environments/environment';

import { makeid, Accents } from '../../../shared/utils';

export interface Theme {
  color: string;
}

export interface Page {
  uid: string;
  index: number;
  path: string;
  alias: string[];
  author: string;
  image: string;
  theme: Theme;
  title: string;
  description: string;
  keywords: string;
  content: string;
  type: string;
  views: number;
  createdAt: Date;
  postedAt: Date;
  deleted: boolean;
  blocked: boolean;
}
export class Page {
  constructor(page) {
    return this.format(page);
  }

  format(page): Page {
    if (!page.uid || page.uid === null || page.uid === undefined) {
      page.uid = 'page-' + makeid(15);
    }
    if (!page.path || page.path === null || page.path === undefined) {
      page.path = makeid(15);

      if (page.title) {
        page.path = new Accents()
          .removeDiacritics(page.title)
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/[`~!@#$%^&*()_|+\-=÷¿?;°:'",.<>\{\}\[\]\\\/]/gi, '')
          .replace(/ /g, '-');
      }
    }
    if (!page.alias || page.alias === null || page.alias === undefined) {
      page.alias = [];

      if (page.title) {
        page.alias.push(page.uid);
      }
    }
    if (!page.alias || page.author === null || page.author === undefined) {
      page.author = 'Anonimo';

      if (localStorage.getItem('authenticated-email')) {
        page.author = localStorage.getItem('authenticated-email');
      }
    }
    if (!page.image || page.image === null || page.image === undefined) {
      page.image = environment.backgroundImage;
    }
    if (!page.theme || page.theme === null || page.theme === undefined) {
      page.theme = environment.theme;
    }
    if (!page.description || page.description === null || page.description === undefined) {
      page.description = '';

      if (page.title) {
        page.description = page.title;
      }
    }
    if (!page.keywords || page.keywords === null || page.keywords === undefined) {
      page.keywords = '';

      if (page.title) {
        page.keywords = page.title;
      }
    }
    if (!page.type || page.type === null || page.type === undefined) {
      page.type = 'page';
    }
    if (!page.views || page.views === null || page.views === undefined) {
      page.views = 0;
    }
    if (page.blocked === null || page.blocked === undefined) {
      page.blocked = true;
    }
    if (page.deleted === null || page.deleted === undefined) {
      page.deleted = false;
    }
    if (!page.postedAt || page.postedAt === null || page.postedAt === undefined) {
      page.postedAt = new Date();
    }
    if (!page.createdAt || page.createdAt === null || page.createdAt === undefined) {
        page.createdAt = new Date();
    }

    return page;
  }
}

export interface Pages {
  [key: string]: Page;
}
