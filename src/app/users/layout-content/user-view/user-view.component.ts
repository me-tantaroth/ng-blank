import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { UserService } from '../../services/users.service';

import { User } from '../../models/user';


@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {
  user: Observable<User>;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.user = this.userService.filter('uid', id);
    } else {
      this.route.paramMap
        .subscribe((params) => {
          id = params.get('id');

          this.user = this.userService.filter('uid', id);
        })
        .unsubscribe();
    }
  }
}
