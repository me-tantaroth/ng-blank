import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { Config, ConfigService } from '../../shared/services/config.service';

import { UserService } from '../../core/users/services/users.service';

import { User } from '../../core/users/models/user';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {
  config: Config;
  user: Observable<User>;

  constructor(
    private configService: ConfigService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.config = this.configService.get();
  }

  ngOnInit() {
    let uid = this.route.snapshot.paramMap.get('uid');

    if (uid) {
      this.user = this.userService.filter({ uid }).pipe((o) => o[0]);
    } else {
      this.route.paramMap
        .subscribe((params) => {
          uid = params.get('uid');

          this.user = this.userService.filter({ uid }).pipe((o) => o[0]);
        })
        .unsubscribe();
    }
  }
}
