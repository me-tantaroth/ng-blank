import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-load-layout',
  templateUrl: './load-layout.component.html',
  styleUrls: ['./load-layout.component.scss']
})
export class LoadLayoutComponent implements OnInit {
  @Input() template: string;

  @ViewChild('default') default;

  authenticated: Observable<boolean>;

  templates = {
    default: null
  };

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.authenticated = this.auth.authenticated;

    this.templates.default = this.default;
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
