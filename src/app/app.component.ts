import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, Event, NavigationEnd } from '@angular/router';
import { TdLoadingService } from './covalent.module';

import { StoreService } from 'ng-barn';
import { ConfigService, Config } from './shared/services/config.service';
import { LAYOUTS } from './layouts';

import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loader: boolean;
  title = 'ng-blank';

  constructor(
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private router: Router,
    private _loadingService: TdLoadingService,
    private store: StoreService,
    private configService: ConfigService
  ) {
    this._loadingService.register('loader');

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this._loadingService.resolve('loader');
      }
    });

    let PROJECT_ID: string;

    function getDomainName(hostName) {
      return hostName
        .substring(hostName.lastIndexOf('.', hostName.lastIndexOf('.') - 1) + 1)
        .split('.')[0];
    }

    function getSubdomain(hostname) {
      const regexParse = new RegExp('[a-z-0-9]{2,63}.[a-z.]{2,5}$');
      const urlParts = regexParse.exec(hostname);
      return hostname.replace(urlParts[0], '').slice(0, -1);
    }

    if (environment.production) {
      if (
        getDomainName(window.location.hostname) &&
        getDomainName(window.location.hostname) !== 'firebaseapp'
      ) {
        PROJECT_ID = getDomainName(window.location.hostname);
      } else {
        PROJECT_ID = environment.project.uuid;
      }
    } else {
      if (environment.project && environment.project.uuid) {
        PROJECT_ID = environment.project.uuid;
      }
    }

    console.log('## PROJECT ID', PROJECT_ID);

    const NODE = this.store.get('node');

    this.configService.set({
      project: {
        uuid: PROJECT_ID,
        layout: LAYOUTS[NODE[PROJECT_ID]] ? NODE[PROJECT_ID] : 'default',
        lang: navigator.language.split('-')[0]
      }
    });
  }

  ngOnInit() {
    this._loadingService.resolve('loader');

    console.log('> ENTER')
    this.configService.get().subscribe(
      (config: Config) => {
        this._document.querySelector('link[rel="icon"]').setAttribute('href', config.project.favicon);
        console.log('>>> CONFIG', config);
      }
    );
  }
}
