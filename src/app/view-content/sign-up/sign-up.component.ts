import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Config, ConfigService } from '../../shared/services/config.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  config: Observable<Config>;

  constructor(private configService: ConfigService) {
    this.config = this.configService.get();
  }

  ngOnInit() {}
}
