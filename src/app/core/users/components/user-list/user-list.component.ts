import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

import { AuthService } from '../../../../core/auth/services/auth.service';
import { UserService } from '../../services/users.service';

import { User } from '../../models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @Input() filter: string;

  panelOpenState: boolean;
  users: Observable<User[]>;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.users = this.userService.list().pipe(
      map((users: User[]) =>
        _.filter(users, (o) => {
          let match: boolean;

          if (this.filter) {
            match = o[this.filter] === !!this.filter;
          } else {
            match = o.deleted === false;
          }

          return match;
        })
      )
    );
  }

  verfifyEmail(uid: string, user: User) {
    user.emailVerified = true;

    this.userService.set({ uid }, user);
  }

  blockUser(uid: string, user: User) {
    user.blocked = true;

    this.userService.set({ uid }, user);
  }

  deleteUser(uid: string, user: User) {
    user.deleted = true;

    this.userService.set({ uid }, user);
  }
}
