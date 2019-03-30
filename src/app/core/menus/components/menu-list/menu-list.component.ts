import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';

import {
  MenuService,
  ServiceResponse as MenuServiceResponse
} from '../../services/menu.service';

import { Menu } from '../../models/menu';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  @Input() filter: string;
  @Input() value: string;

  currentMenu: Menu;
  menuList: Observable<Menu[]>;
  backMenu: Observable<Menu[]>;

  constructor(private menuService: MenuService, private router: Router) {
    router.events.subscribe((data) => {
      if (data instanceof ActivationEnd) {
        if (
          !!data.snapshot.params.filter &&
          data.snapshot.params.filter === 'path' &&
          !!data.snapshot.params.value
        ) {
          this.filter = data.snapshot.params.filter;
          this.value = data.snapshot.params.value;

          this.menuService
            .itemWithPath(this.value)
            .subscribe((menu) => {
              console.log('## MENU', menu);
              this.currentMenu = menu;
              this.menuList = of(menu.menu);
            })
            .unsubscribe();
        }
      }
    });
  }

  ngOnInit() {
    if (!!this.filter && this.filter === 'path' && !!this.value) {
      console.log('## FILTER PATH');
      this.menuService
        .itemWithPath(this.value)
        .subscribe((menu) => {
          console.log('## MENU', menu);
          this.currentMenu = menu;
        })
        .unsubscribe();
      this.menuList = this.menuService.filterWithPath(this.value, {
        deleted: false
      });
    } else if (!!this.filter && this.filter === 'deleted') {
      console.log('## FILTER DELETED');

      if (!!this.value) {
        this.menuList = this.menuService.listWithPath(this.value);
      } else {
        this.menuList = this.menuService.list();
      }
    } else {
      this.filter = 'path';

      console.log('## ONLY NOT DELETED');
      this.menuList = this.menuService.filter({
        deleted: false
      });
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
      if (menu.root) {
        this.router.navigate(['/admin/menu/list/' + (this.filter || '')]);
      } else {
        this.router.navigate([
          '/admin/menu/list/' + (this.filter || ''),
          menu.backPath || ''
        ]);
      }
    }
  }

  onBlockMenu(menu: Menu) {
    menu.blocked = true;

    this.menuService
      .setWithPath(menu.path, menu)
      .subscribe((response: MenuServiceResponse) => {
        if (response && response.list) {
          this.menuList = of(response.list);
        }
      })
      .unsubscribe();
  }

  onDeleteMenu(menu: Menu) {
    menu.deleted = true;

    this.menuService
      .setWithPath(menu.path, menu)
      .subscribe((response: MenuServiceResponse) => {
        if (response && response.list) {
          this.menuList = of(response.list);
        }
      })
      .unsubscribe();
  }
}
