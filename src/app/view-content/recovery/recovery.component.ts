import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Config, ConfigService } from '../../shared/services/config.service';

import { AuthService } from '../../core/auth/services/auth.service';

import { Message } from '../../models/message';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent implements OnInit {
  config: Config;
  authEmail: string;
  message: Message = {
    show: false
  };

  constructor(
    private configService: ConfigService,
    private router: Router,
    private auth: AuthService
  ) {
    // this.config = this.configService.get();
    this.authEmail = window.localStorage.getItem('authenticated-email');
    if (!this.authEmail) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {}

  recovery(email: string) {
    this.auth
      .recoveryPassword(email)
      .subscribe((response) => {
        if (response.status) {
          // SEND EMAIL TO RECOVERY ACCOUNT
          this.message = {
            show: true,
            label: 'Info',
            sublabel: `Se ha enviado un correo a ${email} para recuperar tu cuenta`,
            color: 'accent',
            icon: 'info'
          };
        }
      })
      .unsubscribe();
  }
}
