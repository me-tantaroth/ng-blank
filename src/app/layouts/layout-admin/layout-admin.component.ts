import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { TdMediaService } from '@covalent/core';

import { AuthService } from '../../auth/services/auth.service';

import { User } from '../../users/models/user';

@Component({
  selector: 'app-layout-admin',
  templateUrl: './layout-admin.component.html',
  styleUrls: ['./layout-admin.component.scss']
})
export class LayoutAdminComponent implements OnInit {
  name = 'AFROUP';

  user: User;

  routes: any[] = [
    {
      icon: 'home',
      route: '/dashboard',
      title: 'Dashboard'
    },
    {
      icon: 'people',
      route: '/user/list',
      title: 'Users'
    }
  ];
  usermenu: any[] = [
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
    this.authService.getUser().subscribe(
      response => {
        if (response.status) {
          this.user = response.data;
        }
      }
    );
  }
}
