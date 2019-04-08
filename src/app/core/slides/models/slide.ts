import { makeid } from '../../../shared/utils';

export interface Slides {
  [key: string]: Slide;
}

export interface Slide {
  uid: string;
  image: string;
  title?: string;
  subtitle?: string;
  url?: string;
  externalURL: boolean;
  currentPath: string;
  dbPath: string;
  blocked: boolean;
  deleted: boolean;
  deletedCount: number;
  createdAt: Date;
}
export class Slide {
  constructor(slide) {
    return this.format(slide);
  }

  format(slide) {
    if (!slide.uid || slide.uid === null || slide.uid === undefined) {
      slide.uid = 'slide-' + makeid(15);
    }
    if (slide.externalURL === null || slide.externalURL === undefined) {
      slide.externalURL = false;
    }
    if (slide.blocked === null || slide.blocked === undefined) {
      slide.blocked = true;
    }
    if (slide.deleted === null || slide.deleted === undefined) {
      slide.deleted = true;
    }
    if (slide.deletedCount === null || slide.deletedCount === undefined) {
      slide.deletedCount = 0;
    }
    if (
      !slide.createdAt ||
      slide.createdAt === null ||
      slide.createdAt === undefined
    ) {
      slide.createdAt = new Date();
    }
    return slide;
  }
}
