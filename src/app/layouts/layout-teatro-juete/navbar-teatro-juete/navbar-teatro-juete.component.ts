import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '../../../core/auth/services/auth.service';
import { MenuService } from '../../../core/menus/services/menu.service';
import { ConfigService, Config } from '../../../shared/services/config.service';

import { Menu } from '../../../core/menus/models/menu';

@Component({
  selector: 'app-navbar-teatro-juete',
  templateUrl: './navbar-teatro-juete.component.html',
  styleUrls: ['./navbar-teatro-juete.component.scss']
})
export class NavbarTeatroJueteComponent implements OnInit {
  authenticated: Observable<boolean>;
  menu: Observable<Menu[]>;
  config: Observable<Config>;

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    this.config = this.configService.get();
    this.authenticated = this.authService.authenticated;
    this.menu = this.menuService.list('|list');
  }

  submenu(menu: Menu[]) {
    let html = '';
    // if (menu && menu.length && menu.length > 0) {
    //   for (let item of menu) {
    //     html += `<li>`;
    //       html += `<a href="${item.link}">${item.text}</a>`;
    //       if (item.menu && item.menu.length && item.menu.length > 0) {
    //         html += '<div class="uk-navbar-dropdown">';
    //           html += '<ul class="uk-nav uk-navbar-dropdown-nav">';
    //             html += this.submenu(item.menu);
    //           html += '</ul>';
    //         html += '</div>';
    //       }
    //     html += '</li>';
    //   }
    // }

    console.log(html);
    return html;
  }

  signOut() {
    this.authService
      .signOut()
      .subscribe()
      .unsubscribe();
  }
}
