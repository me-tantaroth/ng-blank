import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';
import * as _ from 'lodash';
import { StoreService } from 'ng-barn';

import { ModulesService } from '../../../modules/services/modules.service';
import { UserService } from '../../../users/services/user.service';
import { MenuService } from '../../services/menu.service';

import { Module } from 'src/app/core/modules/models/module';
import { User } from 'src/app/core/users/models/user';
import { Menu } from '../../models/menu';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  @Input() filter: string;
  @Input() value: string;

  ObjectKeys = Object.keys;
  panelOpenState: boolean;
  currentMenu: Observable<Menu>;
  menus: Observable<Menu[]>;
  backMenu: Observable<Menu[]>;

  constructor(
    private store: StoreService,
    private modulesService: ModulesService,
    private userService: UserService,
    private menuService: MenuService,
    private router: Router
  ) {
    router.events.subscribe((data) => {
      if (data instanceof ActivationEnd) {
        if (!!data.snapshot.params.filter && !!data.snapshot.params.value) {
          this.filter = data.snapshot.params.filter;
          this.value = data.snapshot.params.value;
          const currentMenu = data.snapshot.params.value.split('|');

          currentMenu.pop();

          switch (data.snapshot.params.filter) {
            case 'list':
              if (currentMenu.join('|') !== '') {
                this.currentMenu = this.menuService.getItem(
                  currentMenu.join('|')
                );
              }
              this.menus = this.menuService.list(data.snapshot.params.value);
              break;
          }
        }
      }
    });
  }

  ngOnInit() {
    if (!!this.filter && !!this.value) {
      const currentMenu = this.value.split('|');

      currentMenu.pop();

      switch (this.filter) {
        case 'list':
          if (currentMenu.join('|') !== '') {
            this.currentMenu = this.menuService.getItem(currentMenu.join('|'));
          }
          this.menus = this.menuService.list(this.value);
          break;
      }
    } else {
      this.filter = 'list';
      this.menus = this.menuService.list('|' + this.filter);
    }
  }

  onAddMenu(menu: Menu) {
    if (menu) {
      if (!!this.filter && this.filter === 'path' && !!this.value) {
        this.router.navigate(['/admin/menu/form/add', this.value]);
      } else {
        this.router.navigate(['/admin/menu/form/add']);
      }
    } else {
      this.router.navigate(['/admin/menu/form/add']);
    }
  }

  onBlockMenu(path: string, menu: Menu) {
    const splitPath = path.split('|');
    splitPath.shift();
    splitPath.shift();

    menu.blocked = true;

    // this.menuService
    //   .setItem('|blocked|' + splitPath.join('|'), menu)
    //   .pipe(first())
    //   .subscribe(() => {
    //       this.menuService
    //         .removeItem('|enabled|' + splitPath.join('|'))
    //         .pipe(first())
    //         .subscribe((statusEnabled: boolean) => {
    //           if (statusEnabled) {
    //             this.onBackMenu(menu);
    //           }
    //         });
    //   });
  }

  onUnBlockMenu(path: string, menu: Menu) {
    menu.blocked = false;

    // this.menuService
    //   .setItem(path, menu)
    //   .pipe(first())
    //   .subscribe(() => {
    //     if (status) {
    //       this.menuService
    //         .removeItem('|blocked|' + menu.uid)
    //         .pipe(first())
    //         .subscribe((statusRemoved: boolean) => {
    //           if (statusRemoved) {
    //             this.onBackMenu(menu);
    //           }
    //         });
    //     }
    //   });
  }

  onDeleteMenu(menu: Menu) {
    const menuModule$: Observable<Module> = this.modulesService.getItem(
      '|menu'
    );
    const currentUser$: Observable<User> = this.userService.getItem(
      this.store.get('currentUserPermissions').path
    );

    if (confirm(`Seguro que desea eliminar a '${menu.text}'?`)) {
      combineLatest([menuModule$, currentUser$])
        .pipe(first())
        .subscribe(([menuModule, currentUser]) => {
          if (currentUser.permissions.menu_delete) {
            menuModule.count = menuModule.count - 1;

            this.modulesService
              .setItem('|menu', menuModule)
              .pipe(first())
              .subscribe(() => {
                menu.deleted = true;

                const path = menu.customPath.split('|');

                path.pop();

                this.menuService
                  .removeItem(path.join('|'))
                  .pipe(first())
                  .subscribe(() => {
                    if (status) {
                      this.menuService
                        .removeItem('|enabled|' + menu.uuid)
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

  onUnDeletedMenu(path: string, menu: Menu) {
    menu.deleted = false;

    // this.menuService
    //   .setItem(path, menu)
    //   .pipe(first())
    //   .subscribe(() => {
    //     if (status) {
    //       this.menuService
    //         .removeItem('|deleted|' + menu.uid)
    //         .pipe(first())
    //         .subscribe((statusDeleted: boolean) => {
    //           if (statusDeleted) {
    //             this.menus = this.menuService.list('|deleted');
    //           }
    //         });
    //     }
    //   });
  }
}
