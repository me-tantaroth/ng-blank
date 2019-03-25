import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { UserService, ServiceResponse } from '../../services/users.service';

import { User } from '../../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User;

  constructor(private userService: UserService) {}

  ngOnInit() {
    if (localStorage.getItem('authenticated-email')) {
      this.userService
        .filter('email', localStorage.getItem('authenticated-email'))
        .subscribe((user: User) => (this.user = user))
        .unsubscribe();
    }
  }
}
