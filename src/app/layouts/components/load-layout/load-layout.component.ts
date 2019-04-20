import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../../core/auth/services/auth.service';

import { Config } from '../../../shared/services/config.service';

@Component({
  selector: 'app-load-layout',
  templateUrl: './load-layout.component.html',
  styleUrls: ['./load-layout.component.scss']
})
export class LoadLayoutComponent implements OnInit {
  @Input() config: Config;

  @ViewChild('default') default;
  @ViewChild('corpayande') corpayande;

  authenticated: Observable<boolean>;

  templates = {
    default: null,
    corpayande: null
  };

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    // this.authenticated = new Observable(observer => observer.next(true));
    this.authenticated = this.auth.authenticated;

    this.templates.default = this.default;
    this.templates.corpayande = this.corpayande;
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
