import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-layout-pijaoscaciques',
  templateUrl: './layout-pijaoscaciques.component.html',
  styleUrls: ['./layout-pijaoscaciques.component.scss']
})
export class LayoutPijaosCaciquesComponent implements OnInit {
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
