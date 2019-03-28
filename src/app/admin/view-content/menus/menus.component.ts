import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})
export class MenusComponent implements OnInit {
  paramFilter: string;
  paramValue: string;

  constructor(private route: ActivatedRoute) {}

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
