import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Config, ConfigService } from '../../shared/services/config.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  config: Config;
  paramFilter: string;
  paramValue: string;

  constructor(
    private configService: ConfigService,
    private route: ActivatedRoute
  ) {
    this.config = this.configService.get();
  }

  ngOnInit() {
    const paramFilter = this.route.snapshot.paramMap.get('filter');

    if (paramFilter) {
      this.paramFilter = paramFilter;
    } else {
      this.route.paramMap
        .subscribe((params) => {
          this.paramFilter = params.get('filter');
        })
        .unsubscribe();
    }

    const paramValue = this.route.snapshot.paramMap.get('value');

    if (paramValue) {
      this.paramValue = paramValue;
    } else {
      this.route.paramMap
        .subscribe((params) => {
          this.paramValue = params.get('value');
        })
        .unsubscribe();
    }
  }
}
