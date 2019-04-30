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
  @ViewChild('disabled') disabled;
  @ViewChild('corpayande') corpayande;
  @ViewChild('teatroJuete') teatroJuete;
  @ViewChild('pijaoscaciques') pijaoscaciques;

  authenticated: Observable<boolean>;

  templates = {
    default: null,
    disabled: null,
    corpayande: null,
    teatroJuete: null,
    pijaoscaciques: null
  };

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.authenticated = this.auth.authenticated;

    this.templates.default = this.default;
    this.templates.disabled = this.disabled;
    this.templates.corpayande = this.corpayande;
    this.templates.teatroJuete = this.teatroJuete;
    this.templates.pijaoscaciques = this.pijaoscaciques;
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
