import { makeid } from '../../../shared/utils';

export interface Slide {
  uuid: string;
  image: string;
  name: string;
  text?: string;
  subtitle?: string;
  url?: string;
  externalURL: boolean;
  customPath: string;
  absolutePath: string;
  backPath: string;
  postedAt: Date;
  root?: boolean;
  user: string; // uuid of user modifier
  blocked: boolean;
  deleted: boolean;
  deleteCount: number;
  createdAt: Date;
}
export class Slide {
  constructor(slide = {}) {
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
