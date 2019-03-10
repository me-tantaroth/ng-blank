import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { TdMediaService } from '@covalent/core';

@Component({
  selector: 'app-layout-admin',
  templateUrl: './layout-admin.component.html',
  styleUrls: ['./layout-admin.component.scss']
})
export class LayoutAdminComponent implements OnInit {
  name = 'AFROUP';

  routes: Object[] = [
    {
      icon: 'home',
      route: '.',
      title: 'Dashboard'
    },
    {
      icon: 'people',
      route: '/user/list',
      title: 'Users'
    },
    {
      icon: 'library_books',
      route: '.',
      title: 'Documentation'
    },
    {
      icon: 'color_lens',
      route: '.',
      title: 'Style Guide'
    },
    {
      icon: 'view_quilt',
      route: '.',
      title: 'Layouts'
    },
    {
      icon: 'picture_in_picture',
      route: '.',
      title: 'Components & Addons'
    }
  ];
  usermenu: Object[] = [
    {
      icon: 'swap_horiz',
      route: '.',
      title: 'Switch account'
    },
    {
      icon: 'tune',
      route: '.',
      title: 'Account settings'
    },
    {
      icon: 'exit_to_app',
      route: '/auth/sign-out',
      title: 'Sign out'
    }
  ];

  constructor(
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

  ngOnInit() {}
}
