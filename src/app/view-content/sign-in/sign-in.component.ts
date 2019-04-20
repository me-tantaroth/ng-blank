import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Config, ConfigService } from '../../shared/services/config.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  config: Observable<Config>;

  constructor(private configService: ConfigService) {
    this.config = this.configService.get();
  }

  ngOnInit() {
  }

}
