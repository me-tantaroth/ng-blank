import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

import { MenuService } from '../../services/menu.service';

import { Menu } from '../../models/menu';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  @Input() filter: string;

  panelOpenState: boolean;
  menus: Observable<Menu[]>;

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.menus = this.menuService.list().pipe(
      map((menus: Menu[]) =>
        _.filter(menus, (o) => {
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

  blockMenu(uid: string, menu: Menu) {
    menu.blocked = true;

    this.menuService.set({ uid }, menu);
  }

  deleteMenu(uid: string, menu: Menu) {
    menu.deleted = true;

    this.menuService.set({ uid }, menu);
  }
}
