import { environment } from '../../../../environments/environment';

import { makeid } from '../../../shared/utils';

export interface Users {
  [key: string]: User;
}

export interface User {
  uid: string;
  displayName?: string;
  email: string;
  username: string;
  phoneNumber?: string;
  cover: string; // PATH ABSOLUTE
  photoURL?: string; // PATH ABSOLUTE
  emailVerified: boolean;
  aboutMe?: string;
  cite?: string;
  root: boolean;
  dbPath: string;
  backPath: string;
  currentPath: string;
  principalPath: string;
  alias: string[];
  blocked: boolean;
  deleted: boolean;
  deletedCount: number;
  createdAt: Date;
}
export class User {
  constructor(user) {
    return this.format(user);
  }

  format(user) {
    if (!user) {
      user = {
        uid: 'user-' + makeid(15),
        displayName: '',
        email: '',
        username: '',
        phoneNumber: '',
        cover: '', // PATH ABSOLUTE
        photoURL: '', // PATH ABSOLUTE
        emailVerified: false,
        aboutMe: '',
        cite: '',
        root: false,
        dbPath: '',
        backPath: '',
        currentPath: '',
        principalPath: '',
        alias: [''],
        blocked: false,
        deleted: false,
        deletedCount: 0,
        createdAt: new Date(),
      };
    }

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
      user.blocked = false;
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
