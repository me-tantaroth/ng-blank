import { Component, OnInit } from '@angular/core';
import { StoreService } from 'ng-barn';

import { User } from '../../models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private store: StoreService) {
    store.select('users');
  }

  ngOnInit() {
    this.users = this.store.get();
  }

}
