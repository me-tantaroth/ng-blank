import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';

import { Config, ConfigService } from '../../shared/services/config.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  config: Config;
  filter: string;
  value: string;

  constructor(
    private configService: ConfigService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // this.config = this.configService.get();

    this.router.events.subscribe((data) => {
      if (data instanceof ActivationEnd) {
        if (!!data.snapshot.params.filter) {
          this.filter = data.snapshot.params.filter;
        }
        if (!!data.snapshot.params.value) {
          this.value = data.snapshot.params.value;
        }
      }
    });
  }

  ngOnInit() {
    const filter = this.route.snapshot.paramMap.get('filter');

    if (filter) {
      this.filter = filter;
    } else {
      this.route.paramMap
        .subscribe((params) => {
          this.filter = params.get('filter');
        })
        .unsubscribe();
    }

    const value = this.route.snapshot.paramMap.get('value');

    if (value) {
      console.log('## VALUE', value);
      this.value = value;
    } else {
      this.route.paramMap
        .subscribe((params) => {
          this.value = params.get('value');
        })
        .unsubscribe();
    }
  }
}
