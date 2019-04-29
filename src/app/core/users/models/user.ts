import { environment } from '../../../../environments/environment';

import { makeid } from '../../../shared/utils';

export interface Permissions {
  [key: string]: any;
}

export interface User {
  absolutePath: string;
  blocked: boolean;
  cover: string;
  createdAt: Date;
  deletedCount: number;
  deleted: boolean;
  displayName: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  name: string;
  permissions: Permissions;
  photoURL: string;
  uuid: string;
  phoneNumber?: string;
  aboutMe?: string;
  cite?: string;
  root: boolean;
  backPath: string;
  postedAt: Date;
  customPath: string;
  principalPath: string;
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

    if (!user.uuid || user.uuid === null || user.uuid === undefined) {
      user.uuid = 'user-' + makeid(15);
    }
    if (
      !user.name ||
      user.name === null ||
      user.name === undefined
    ) {
      user.name = '';

      if (user.email) {
        user.name = user.email.split('@')[0];
      }
    }
    if (!user.name || user.cover === null || user.cover === undefined) {
      user.cover = environment.backgroundImage;
    }
    if (
      !user.name ||
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
