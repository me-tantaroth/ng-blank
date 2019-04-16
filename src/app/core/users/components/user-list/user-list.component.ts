import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import * as _ from 'lodash';

import { AuthService } from '../../../../core/auth/services/auth.service';
import { UserService } from '../../../../core/users/services/users.service';

import { User, Users } from '../../../../core/users/models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @Input() filter: string;
  @Input() value: string;

  ObjectKeys = Object.keys;
  panelOpenState: boolean;
  currentUser: Observable<User>;
  userList: Observable<Users>;
  backUser: Observable<Users>;

  constructor(private userService: UserService, private router: Router) {
    router.events.subscribe((data) => {
      if (data instanceof ActivationEnd) {
        if (
          !!data.snapshot.params.filter &&
          data.snapshot.params.filter === 'enabled|list' &&
          !!data.snapshot.params.value
        ) {
          this.currentUser = this.userService.getItem(
            data.snapshot.params.value
          );
          this.userList = this.userService.list(
            data.snapshot.params.value + '|enabled|list'
          );
        } else {
          if (
            !!data.snapshot.params.filter &&
            (data.snapshot.params.filter === 'enabled|list' ||
              data.snapshot.params.filter === 'blocked' ||
              data.snapshot.params.filter === 'deleted') &&
            !data.snapshot.params.value
          ) {
            console.log('¡?¡¡¡¡¡¡¡¡', data.snapshot.params.filter);
            this.userList = this.userService.list(
              '|' + data.snapshot.params.filter
            );
          }
        }
      }
    });
  }

  ngOnInit() {
    if (!!this.filter && this.filter === 'enabled|list' && !!this.value) {
      console.log('## FILTER PATH');
      this.currentUser = this.userService.getItem(this.value);

      this.userList = this.userService.list(this.value + '|enabled|list');
    } else {
      this.filter = this.filter || 'enabled|list';

      console.log('## ONLY NOT DELETED');
      this.userList = this.userService.list('|' + this.filter);
      this.userList.subscribe((data) => console.log('QQQQ', data));
    }
  }

  onAddUser(user: User) {
    if (user) {
      if (!!this.filter && this.filter === 'path' && !!this.value) {
        this.router.navigate(['/admin/user/form/add', this.value]);
      } else {
        this.router.navigate(['/admin/user/form/add']);
      }
    } else {
      this.router.navigate(['/admin/user/form/add']);
    }
  }

  onBackUser(user: User) {
    if (user) {
      this.router.navigate([
        '/admin/user/list/' + (this.filter || 'enabled|list'),
        user.backPath || ''
      ]);
    }
  }

  onBlockUser(path: string, user: User) {
    const splitPath = path.split('|');
    splitPath.shift();
    splitPath.shift();

    user.blocked = true;

    console.log('## BLOCKED', path, user, '|blocked|' + splitPath.join('|'));

    this.userService
      .setItem('|blocked|' + splitPath.join('|'), user)
      .pipe(first())
      .subscribe((status: boolean) => {
        if (status) {
          this.userService
            .removeItem('|enabled|list|' + splitPath.join('|'))
            .pipe(first())
            .subscribe((statusEnabled: boolean) => {
              if (statusEnabled) {
                this.onBackUser(user);
              }
            });
        }
      });
  }

  onUnBlockUser(path: string, user: User) {
    user.blocked = false;

    this.userService
      .setItem(path, user)
      .pipe(first())
      .subscribe((status: boolean) => {
        if (status) {
          this.userService
            .removeItem('|blocked|' + user.uid)
            .pipe(first())
            .subscribe((statusRemoved: boolean) => {
              if (statusRemoved) {
                this.onBackUser(user);
              }
            });
        }
      });
  }

  onDeleteUser(path: string, user: User) {
    if (confirm(`Seguro que desea eliminar a '${user.displayName}'?`)) {
      user.deleted = true;

      this.userService
        .setItem(path, user)
        .pipe(first())
        .subscribe((status: boolean) => {
          if (status) {
            this.userService
              .removeItem('|enabled|lis|' + user.uid)
              .pipe(first())
              .subscribe((statusEnabled: boolean) => {
                if (statusEnabled) {
                  this.userList = this.userService.list('|enabled|lis');
                }
              });
          }
        });
    }
  }

  onUnDeletedUser(path: string, user: User) {
    user.deleted = false;

    this.userService
      .setItem(path, user)
      .pipe(first())
      .subscribe((status: boolean) => {
        if (status) {
          this.userService
            .removeItem('|deleted|' + user.uid)
            .pipe(first())
            .subscribe((statusDeleted: boolean) => {
              if (statusDeleted) {
                this.userList = this.userService.list('|deleted');
              }
            });
        }
      });
  }

  verfifyEmail(uid: string, user: User) {
    user.emailVerified = true;

    // this.userService.set({ uid }, user);
  }
}
