import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { MenuService } from '../../../core/menus/services/menu.service';

import { Menu } from '../../../core/menus/models/menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  menu: Menu;
  filter: string;
  value: string;

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    const value = this.route.snapshot.paramMap.get('value');

    if (value) {
      this.value = value;

      this.menuService
        .getItem(value)
        .subscribe((menu: Menu) => (this.menu = menu))
        .unsubscribe();
    } else {
      this.route.paramMap
        .subscribe((params) => {
          if (params.get('value')) {
            this.value = params.get('value');

            this.menuService
              .getItem(value)
              .pipe(first())
              .subscribe((menu: Menu) => (this.menu = menu));
          }
        })
        .unsubscribe();
    }

    const filter = this.route.snapshot.paramMap.get('filter');

    if (filter) {
      this.filter = filter;
    } else {
      this.filter = 'add';

      this.route.paramMap
        .subscribe((params) => {
          if (params.get('filter')) {
            this.filter = params.get('filter');
          }
        })
        .unsubscribe();
    }
  }
}
