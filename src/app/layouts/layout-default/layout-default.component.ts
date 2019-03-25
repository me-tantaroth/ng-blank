import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-layout-default',
  templateUrl: './layout-default.component.html',
  styleUrls: ['./layout-default.component.scss']
})
export class LayoutDefaultComponent implements OnInit {
  authenticated: Observable<boolean>;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.authenticated = this.auth.authenticated;
  }

  signOut() {
    this.auth
      .signOut()
      .subscribe((status) => {
        if (status) {
          this.router.navigate(['/auth/sign-out']);
        }
      })
      .unsubscribe();
  }
}
