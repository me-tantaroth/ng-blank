import { Component, OnInit, Input } from '@angular/core';

import { Page } from '../../models/page';

@Component({
  selector: 'app-page-info',
  templateUrl: './page-info.component.html',
  styleUrls: ['./page-info.component.scss']
})
export class PageInfoComponent implements OnInit {
  @Input() pages: Page[];

  constructor() {}

  ngOnInit() {}
}
