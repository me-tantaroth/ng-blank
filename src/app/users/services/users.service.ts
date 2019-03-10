import { Injectable } from '@angular/core';
import { StoreService } from 'ng-barn';

import { LangsService } from '../../langs/services/langs.service';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users: User[] = [];

  constructor(private store: StoreService, private langs: LangsService) {
    const langsNode = this.store.get('langs-node');

    this.users = langsNode[this.langs.currentLang].users;
  }
}
