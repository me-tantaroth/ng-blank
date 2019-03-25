import { Component, OnInit, Input } from '@angular/core';

import { Page } from '../../models/page';

@Component({
  selector: 'app-page-detail',
  templateUrl: './page-detail.component.html',
  styleUrls: ['./page-detail.component.scss']
})
export class PageDetailComponent implements OnInit {
  @Input() page: Page;

  constructor() { }

  ngOnInit() {
  }

}
