import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';

import { Config, ConfigService } from '../../shared/services/config.service';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.scss']
})
export class SignOutComponent implements OnInit {
  config: Config;

  constructor(private configService: ConfigService, private auth: AuthService) {
    this.config = this.configService.get();
  }

  ngOnInit() {
    this.auth
      .signOut()
      .subscribe()
      .unsubscribe();
  }
}
