import { makeid } from '../../../shared/utils';

export interface Slide {
  uid: string;
  index: number;
  title?: string;
  subtitle?: string;
  redirect?: string;
  image: string;
  blocked: boolean;
  deleted: boolean;
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
    if (slide.blocked === null || slide.blocked === undefined) {
      slide.blocked = true;
    }
    if (slide.deleted === null || slide.deleted === undefined) {
      slide.deleted = true;
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
