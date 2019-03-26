import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

import { MenuService } from '../../services/menu.service';

import { Menu } from '../../models/menu';

interface Path {
  text: string;
  currentMenu: Menu;
  backMenu: Menu[];
}

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  @Input() filter: string;

  currentMenu: Menu;
  pathMenu: Path[] = [];
  panelOpenState: boolean;
  menuList: Observable<Menu[]>;
  menuListAll: Menu[];

  constructor(private menuService: MenuService, private router: Router) {}

  ngOnInit() {
    this.menuList = this.menuService.list().pipe(
      map((menuList: Menu[]) =>
        _.filter(menuList, (o) => {
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

    this.menuList
      .subscribe((menuList: Menu[]) => (this.menuListAll = menuList))
      .unsubscribe();
  }

  submenuList(menu: Menu, menuList: Menu[]) {
    console.log(menu);
    this.pathMenu.push({
      text: menu.backText,
      currentMenu: menu,
      backMenu: menu.backNode.length > 0 ? menu.backNode : this.menuListAll
    });

    this.currentMenu = menu;

    this.menuList = of(menu.submenu);
  }

  newSubmenu(path, currentMenu: Menu) {
    console.log(currentMenu);
    if ((currentMenu && !currentMenu.path) || !currentMenu) {
      this.router.navigate([path]);
    } else {
      this.router.navigate([path, currentMenu.uid, currentMenu.path]);
    }
  }

  backMenu(path: Path) {
    this.pathMenu.pop();

    console.log(path);
    if (path.currentMenu.backNode.length === 0) {
      this.currentMenu = null;
    }

    this.menuList = of(path.backMenu);
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
