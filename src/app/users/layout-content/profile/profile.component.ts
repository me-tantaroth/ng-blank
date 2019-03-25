import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

import { UserService, ServiceResponse } from '../../services/users.service';

import { User } from '../../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  id: string;
  user: User;

  constructor(private userService: UserService) {}

  ngOnInit() {
    if (localStorage.getItem('authenticated-email')) {
      this.userService
        .list()
        .pipe(
          map((users: User[]) => _.filter(users, (user: User, index: string) => {
              const valid: boolean =
                user.email === localStorage.getItem('authenticated-email');

              if (valid) {
                this.id = index.toString();
              }

              return valid;
            }))
        )
        .subscribe();
      this.userService
        .filter('email', localStorage.getItem('authenticated-email'))
        .subscribe((user: User) => (this.user = user))
        .unsubscribe();
    }
  }
}
