import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';
import * as _ from 'lodash';
import { StoreService } from 'ng-barn';

import { ModulesService } from '../../../modules/services/modules.service';
import { UsersService } from '../../../users/services/users.service';
import { UserService } from '../../../users/services/user.service';

import { Module } from '../../../../core/modules/models/module';
import { User } from '../../../../core/users/models/user';

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
  users: Observable<User[]>;
  backUser: Observable<User[]>;

  constructor(
    private store: StoreService,
    private modulesService: ModulesService,
    private usersService: UsersService,
    private userService: UserService,
    private router: Router
  ) {
    router.events.subscribe((data) => {
      if (data instanceof ActivationEnd) {
        if (!!data.snapshot.params.filter && !!data.snapshot.params.value) {
          this.filter = data.snapshot.params.filter;
          this.value = data.snapshot.params.value;
          const currentUser = data.snapshot.params.value.split('|');

          currentUser.pop();

          switch (data.snapshot.params.filter) {
            case 'list':
              if (currentUser.join('|') !== '') {
                this.currentUser = this.userService.getItem(
                  currentUser.join('|')
                );
              }
              this.users = this.userService.list(data.snapshot.params.value);
              break;
          }
        }
      }
    });
  }

  ngOnInit() {
    if (!!this.filter && !!this.value) {
      const currentUser = this.value.split('|');

      currentUser.pop();

      switch (this.filter) {
        case 'list':
          if (currentUser.join('|') !== '') {
            this.currentUser = this.userService.getItem(currentUser.join('|'));
          }
          this.users = this.userService.list(this.value);
          break;
      }
    } else {
      this.filter = 'list';
      this.users = this.userService.list('|' + this.filter);
    }
  }

  onAddUser(user: User) {
    // if (user) {
    //   if (!!this.filter && this.filter === 'path' && !!this.value) {
    //     this.router.navigate(['/admin/user/form/add', this.value]);
    //   } else {
    //     this.router.navigate(['/admin/user/form/add']);
    //   }
    // } else {
    //   this.router.navigate(['/admin/user/form/add']);
    // }
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
    // const splitPath = path.split('|');
    // splitPath.shift();
    // splitPath.shift();
    // user.blocked = true;
    // console.log('## BLOCKED', path, user, '|blocked|' + splitPath.join('|'));
    // this.userService
    //   .setItem('|blocked|' + splitPath.join('|'), user)
    //   .pipe(first())
    //   .subscribe((status: boolean) => {
    //     if (status) {
    //       this.userService
    //         .removeItem('|enabled|list|' + splitPath.join('|'))
    //         .pipe(first())
    //         .subscribe((statusEnabled: boolean) => {
    //           if (statusEnabled) {
    //             this.onBackUser(user);
    //           }
    //         });
    //     }
    //   });
  }

  onUnBlockUser(path: string, user: User) {
    // user.blocked = false;
    // this.userService
    //   .setItem(path, user)
    //   .pipe(first())
    //   .subscribe((status: boolean) => {
    //     if (status) {
    //       this.userService
    //         .removeItem('|blocked|' + user.uid)
    //         .pipe(first())
    //         .subscribe((statusRemoved: boolean) => {
    //           if (statusRemoved) {
    //             this.onBackUser(user);
    //           }
    //         });
    //     }
    //   });
  }

  onDeleteUser(path: string, user: User) {
    const userModule$: Observable<Module> = this.modulesService.getItem(
      '|user'
    );
    const currentUser$: Observable<User> = this.usersService.getItem(
      this.store.get('currentUserPermissions').path
    );

    if (confirm(`Seguro que desea eliminar a '${user.displayName}'?`)) {
      combineLatest([userModule$, currentUser$])
        .pipe(first())
        .subscribe(([userModule, currentUser]) => {
          if (currentUser.permissions.user_delete) {
            userModule.count = userModule.count - 1;

            this.modulesService
              .setItem('|user', userModule)
              .pipe(first())
              .subscribe(() => {
                user.deleted = true;

                const path = user.customPath.split('|');

                path.pop();

                this.usersService
                  .removeItem(path.join('|'))
                  .pipe(first())
                  .subscribe(() => {
                    if (status) {
                      this.usersService
                        .removeItem('|enabled|' + user.uuid)
                        .pipe(first())
                        .subscribe();
                    }
                  });
              });
          } else {
            alert(
              'Error!: No tiene los permisos suficientes para hacer esta acción!'
            );
          }
        });
    }
  }

  onUnDeletedUser(path: string, user: User) {
    // user.deleted = false;
    // this.userService
    //   .setItem(path, user)
    //   .pipe(first())
    //   .subscribe((status: boolean) => {
    //     if (status) {
    //       this.userService
    //         .removeItem('|deleted|' + user.uid)
    //         .pipe(first())
    //         .subscribe((statusDeleted: boolean) => {
    //           if (statusDeleted) {
    //             this.userList = this.userService.list('|deleted');
    //           }
    //         });
    //     }
    //   });
  }

  verfifyEmail(uid: string, user: User) {
    user.emailVerified = true;

    // this.userService.set({ uid }, user);
  }
}
