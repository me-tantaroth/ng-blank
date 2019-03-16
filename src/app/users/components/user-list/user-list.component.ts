import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../auth/services/auth.service';
import { UsersService } from '../../services/users.service';

import { User } from '../../models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  panelOpenState: boolean;
  users: User[] = [];

  constructor(
    private router: Router,
    private auth: AuthService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.users = this.usersService.users;
  }

  verfifyEmail(index: string, user: User) {
    user.emailVerified = true;

    this.users[index] = user;
  }

  blockUser(index: string, user: User) {
    user.blocked = true;

    this.users[index] = user;
  }

  deleteUser(index: string, user: User) {
    user.deleted = true;

    this.users[index] = user;
    this.auth.signOut().subscribe((response) => {
      if (response.status) {
        this.router.navigate(['/auth/sign-out']);
      }
    });
  }
}
