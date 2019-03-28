import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MenuService } from '../../../core/menus/services/menu.service';

import { Menu } from '../../../core/menus/models/menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  menu: Menu;
  path: string;
  action: string;

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    const path = this.route.snapshot.paramMap.get('path');

    if (path) {
      this.path = path;

      this.menuService
        .itemWithPath(path)
        .subscribe((menu: Menu) => (this.menu = menu))
        .unsubscribe();
    } else {
      this.route.paramMap
        .subscribe((params) => {
          const path = params.get('path');
          if (path) {
            this.path = path;

            this.menuService
              .itemWithPath(path)
              .subscribe((menu: Menu) => (this.menu = menu))
              .unsubscribe();
          }
        })
        .unsubscribe();
    }

    const action = this.route.snapshot.paramMap.get('action');

    if (action) {
      this.action = action;
    } else {
      this.action = 'add';

      this.route.paramMap
        .subscribe((params) => {
          const action = params.get('action');
          if (action) {
            this.action = action;
          }
        })
        .unsubscribe();
    }
  }
}
