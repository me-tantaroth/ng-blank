import { environment } from '../../../../environments/environment';

import { makeid, Accents } from '../../../shared/utils';

export interface Theme {
  color: string;
}

export interface Page {
  uuid: string;
  image: string;
  theme: Theme;
  name: string;
  text: string;
  keywords: string;
  description: string;
  content: string;
  url?: string;
  externalURL: boolean;
  absolutePath?: string;
  customPath?: string;
  backPath: string;
  type: string; // article or section type (image/png)
  size?: number;
  lastModifiedDate?: Date;
  views: number;
  postedAt: Date;
  root?: boolean;
  user: string; // uuid of user modifier
  blocked: boolean;
  deleted: boolean;
  deleteCount: number;
  createdAt: Date;
}
export class Page {
  constructor(page = {}) {
    return this.format(page);
  }

  format(page): Page {
    if (!page.url || page.url === null || page.url === undefined) {
      page.url = makeid(15);

      if (page.text) {
        page.url = new Accents()
          .removeDiacritics(page.text)
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/[`~!@#$%^&*()_|+\-=÷¿?;°:'",.<>\{\}\[\]\\\/]/gi, '')
          .replace(/ /g, '-');
      }
    }
    if (!page.image || page.image === null || page.image === undefined) {
      page.image = environment.backgroundImage;
    }
    if (!page.theme || page.theme === null || page.theme === undefined) {
      page.theme = environment.theme;
    }
    if (
      !page.description ||
      page.description === null ||
      page.description === undefined
    ) {
      page.description = '';

      if (page.text) {
        page.description = page.text;
      }
    }
    if (
      !page.keywords ||
      page.keywords === null ||
      page.keywords === undefined
    ) {
      page.keywords = '';

      if (page.text) {
        page.keywords = page.text;
      }
    }
    if (!page.type || page.type === null || page.type === undefined) {
      page.type = 'article';
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
    if (
      !page.postedAt ||
      page.postedAt === null ||
      page.postedAt === undefined
    ) {
      page.postedAt = new Date();
    }
    if (
      !page.createdAt ||
      page.createdAt === null ||
      page.createdAt === undefined
    ) {
      page.createdAt = new Date();
    }

    return page;
  }
}
