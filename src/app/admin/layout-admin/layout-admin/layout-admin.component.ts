import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { TdMediaService } from '@covalent/core';

import { AuthService } from '../../../core/auth/services/auth.service';

import { User } from '../../../core/users/models/user';

@Component({
  selector: 'app-layout-admin',
  templateUrl: './layout-admin.component.html',
  styleUrls: ['./layout-admin.component.scss']
})
export class LayoutAdminComponent implements OnInit {
  name = 'Blank Fire';

  user: Observable<User>;

  routes: any[] = [
    {
      icon: 'home',
      route: '/admin/dashboard',
      title: 'Tablero'
    },
    {
      icon: 'people',
      route: '/admin/user/enabled',
      title: 'Usuarios'
    },
    {
      icon: 'insert_drive_file',
      route: '/admin/page/enabled',
      title: 'Páginas'
    },
    {
      icon: 'slideshow',
      route: '/admin/slide/enabled',
      title: 'Carrusel'
    },
    {
      icon: 'menu',
      route: '/admin/menu/enabled',
      title: 'Menú'
    },
    {
      icon: 'folder',
      route: '/admin/file/enabled',
      title: 'Archivos'
    }
    // {
    //   icon: 'delete',
    //   route: '/admin/trash',
    //   title: 'Trash'
    // }
  ];
  usermenu: any[] = [
    // {
    //   icon: 'swap_horiz',
    //   route: '.',
    //   title: 'Switch account'
    // },
    {
      icon: 'tune',
      route: '/admin/user/profile',
      title: 'Cuenta'
    },
    {
      icon: 'exit_to_app',
      route: '/auth/sign-out',
      title: 'Salir'
    }
  ];

  constructor(
    private authService: AuthService,
    public media: TdMediaService,
    private _iconRegistry: MatIconRegistry,
    private _domSanitizer: DomSanitizer
  ) {
    this._iconRegistry.addSvgIconInNamespace(
      'assets',
      'teradata-ux',
      this._domSanitizer.bypassSecurityTrustResourceUrl(
        'https://raw.githubusercontent.com/Teradata/covalent-quickstart/develop/src/assets/icons/teradata-ux.svg'
      )
    );
    this._iconRegistry.addSvgIconInNamespace(
      'assets',
      'covalent',
      this._domSanitizer.bypassSecurityTrustResourceUrl(
        'https://raw.githubusercontent.com/Teradata/covalent-quickstart/develop/src/assets/icons/covalent.svg'
      )
    );
    this._iconRegistry.addSvgIconInNamespace(
      'assets',
      'covalent-mark',
      this._domSanitizer.bypassSecurityTrustResourceUrl(
        'https://raw.githubusercontent.com/Teradata/covalent-quickstart/develop/src/assets/icons/covalent-mark.svg'
      )
    );
  }

  ngOnInit() {
    this.user = this.authService.currentUser().pipe(map((u) => new User(u)));
  }
}
