import { Component, OnInit } from '@angular/core';
import { StoreService } from 'ng-barn';

import { LangsService } from '../../../langs/services/langs.service';

import { User } from '../../models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private store: StoreService, private langs: LangsService) {
    const langsNode = this.store.get('langs-node');

    this.users = langsNode[this.langs.currentLang].users;
  }

  ngOnInit() {}
}
