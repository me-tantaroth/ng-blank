import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

import { UserService } from '../../../core/users/services/users.service';

import { User } from '../../../core/users/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  uid: string;

  constructor(private userService: UserService) {}

  ngOnInit() {
    if (localStorage.getItem('authenticated-email')) {
      // this.userService
      //   .filter({ email: localStorage.getItem('authenticated-email') })
      //   .subscribe((users: User[]) => {
      //     if (users && users.length > 0 && users.length === 1) {
      //       this.uid = users[0].uid;
      //     }
      //   })
      //   .unsubscribe();
    }
  }
}
