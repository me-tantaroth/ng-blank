import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-navbar-default',
  templateUrl: './navbar-default.component.html',
  styleUrls: ['./navbar-default.component.scss']
})
export class NavbarDefaultComponent implements OnInit {
  authenticated: Observable<boolean>;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.authenticated = this.auth.authenticated;
  }

  signOut() {
    this.auth.signOut().subscribe();
  }

}
