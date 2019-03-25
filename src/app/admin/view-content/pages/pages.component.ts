import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  listFilter: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const listFilter = this.route.snapshot.paramMap.get('filter');

    if (listFilter) {
      this.listFilter = listFilter;
    } else {
      this.route.paramMap
        .subscribe((params) => {
          this.listFilter = params.get('filter');
        })
        .unsubscribe();
    }
  }
}
