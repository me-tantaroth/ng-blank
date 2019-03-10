import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-navbar-default',
  templateUrl: './navbar-default.component.html',
  styleUrls: ['./navbar-default.component.scss']
})
export class NavbarDefaultComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  signOut() {
    this.auth.signOut().subscribe(
      response => {
        if (response.status) {
          // CODE
        }
      }
    );
  }

}
