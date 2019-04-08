import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import * as _ from 'lodash';

import { MenuService } from '../../services/menu.service';

import { Menu, Menus } from '../../models/menu';

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
  menuList: Observable<Menus>;
  backMenu: Observable<Menus>;

  constructor(private menuService: MenuService, private router: Router) {
    router.events.subscribe((data) => {
      if (data instanceof ActivationEnd) {
        if (
          !!data.snapshot.params.filter &&
          data.snapshot.params.filter === 'enabled' &&
          !!data.snapshot.params.value
        ) {
          this.currentMenu = this.menuService.getItem(
            data.snapshot.params.value
          );
          this.menuList = this.menuService.list(
            data.snapshot.params.value + '|enabled'
          );
        } else {
          if (
            !!data.snapshot.params.filter &&
            (data.snapshot.params.filter === 'enabled' ||
              data.snapshot.params.filter === 'blocked' ||
              data.snapshot.params.filter === 'deleted') &&
            !data.snapshot.params.value
          ) {
            console.log('¡?¡¡¡¡¡¡¡¡', data.snapshot.params.filter);
            this.menuList = this.menuService.list(
              '|' + data.snapshot.params.filter
            );
          }
        }
      }
    });
  }

  ngOnInit() {
    if (!!this.filter && this.filter === 'enabled' && !!this.value) {
      console.log('## FILTER PATH');
      this.currentMenu = this.menuService.getItem(this.value);

      this.menuList = this.menuService.list(this.value + '|enabled');
    } else {
      this.filter = this.filter || 'enabled';

      console.log('## ONLY NOT DELETED');
      this.menuList = this.menuService.list('|' + this.filter);
      this.menuList.subscribe(data => console.log('QQQQ', data));
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

  onBackMenu(menu: Menu) {
    if (menu) {
      this.router.navigate([
        '/admin/menu/list/' + (this.filter || 'enabled'),
        menu.backPath || ''
      ]);
    }
  }

  onBlockMenu(path: string, menu: Menu) {
    const splitPath = path.split('|');
    splitPath.shift();
    splitPath.shift();

    menu.blocked = true;

    console.log('## BLOCKED', path, menu, '|blocked|' + splitPath.join('|'));

    this.menuService
      .setItem('|blocked|' + splitPath.join('|'), menu)
      .pipe(first())
      .subscribe((status: boolean) => {
        if (status) {
          this.menuService
            .removeItem('|enabled|' + splitPath.join('|'))
            .pipe(first())
            .subscribe((statusEnabled: boolean) => {
              if (statusEnabled) {
                this.onBackMenu(menu);
              }
            });
        }
      });
  }

  onUnBlockMenu(path: string, menu: Menu) {
    menu.blocked = false;

    this.menuService
      .setItem(path, menu)
      .pipe(first())
      .subscribe((status: boolean) => {
        if (status) {
          this.menuService
            .removeItem('|blocked|' + menu.uid)
            .pipe(first())
            .subscribe((statusRemoved: boolean) => {
              if (statusRemoved) {
                this.onBackMenu(menu);
              }
            });
        }
      });
  }

  onDeleteMenu(path: string, menu: Menu) {
    if (confirm(`Seguro que desea eliminar a '${menu.title}'?`)) {
      menu.deleted = true;

      this.menuService
        .setItem(path, menu)
        .pipe(first())
        .subscribe((status: boolean) => {
          if (status) {
            this.menuService
              .removeItem('|enabled|' + menu.uid)
              .pipe(first())
              .subscribe((statusEnabled: boolean) => {
                if (statusEnabled) {
                  this.menuList = this.menuService.list('|enabled');
                }
              });
          }
        });
    }
  }

  onUnDeletedMenu(path: string, menu: Menu) {
    menu.deleted = false;

    this.menuService
      .setItem(path, menu)
      .pipe(first())
      .subscribe((status: boolean) => {
        if (status) {
          this.menuService
            .removeItem('|deleted|' + menu.uid)
            .pipe(first())
            .subscribe((statusDeleted: boolean) => {
              if (statusDeleted) {
                this.menuList = this.menuService.list('|deleted');
              }
            });
        }
      });
  }
}
