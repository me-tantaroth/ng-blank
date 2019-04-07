import { environment } from '../../../../environments/environment';

import { makeid } from '../../../shared/utils';

export interface User {
  uid: string;
  index: number;
  displayName?: string;
  email: string;
  username: string;
  phoneNumber?: string;
  cover: string; // PATH ABSOLUTE
  photoURL?: string; // PATH ABSOLUTE
  emailVerified: boolean;
  aboutMe?: string;
  cite?: string;
  blocked: boolean;
  deleted: boolean;
  createdAt: Date;
}
export class User {
  constructor(user) {
    return this.format(user);
  }

  format(user) {
    if (!user.uid || user.uid === null || user.uid === undefined) {
      user.uid = 'user-' + makeid(15);
    }
    if (
      !user.username ||
      user.username === null ||
      user.username === undefined
    ) {
      user.username = '';

      if (user.email) {
        user.username = user.email.split('@')[0];
      }
    }
    if (!user.username || user.cover === null || user.cover === undefined) {
      user.cover = environment.backgroundImage;
    }
    if (
      !user.username ||
      user.createdAt === null ||
      user.createdAt === undefined
    ) {
      user.createdAt = new Date();
    }
    if (user.blocked === null || user.blocked === undefined) {
      user.blocked = true;
    }
    if (user.deleted === null || user.deleted === undefined) {
      user.deleted = false;
    }
    if (user.emailVerified === null || user.emailVerified === undefined) {
      user.emailVerified = false;
    }

    return user;
  }
}

export interface Users {
  [key: string]: User;
}
