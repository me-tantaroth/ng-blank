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
    private usersService: UserService
  ) {}

  ngOnInit() {
    this.users = this.usersService.list().pipe(
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

  verfifyEmail(index: string, user: User) {
    user.emailVerified = true;

    this.usersService.set(index, user);
  }

  blockUser(index: string, user: User) {
    user.blocked = true;

    this.usersService.set(index, user);
  }

  deleteUser(index: string, user: User) {
    user.deleted = true;

    this.usersService
      .set(index, user)
      .subscribe()
      .unsubscribe();
  }
}
