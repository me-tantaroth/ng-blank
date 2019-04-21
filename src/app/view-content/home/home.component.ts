import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import * as _ from 'lodash';

import { Config, ConfigService } from '../../shared/services/config.service';

import { PageService } from '../../core/pages/services/page.service';
import { Page } from '../../core/pages/models/page';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  ObjectKeys = Object.keys;
  config: Observable<Config>;
  page: Observable<Page>;

  constructor(
    private configService: ConfigService,
    private pageService: PageService
  ) {
    this.config = this.configService.get();
  }

  log(obj) {
    console.log('## LOG', obj)
  }

  ngOnInit() {
    this.page = this.pageService.getItem('|list|home');
  }
}
