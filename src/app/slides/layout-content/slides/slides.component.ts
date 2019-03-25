import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss']
})
export class SlidesComponent implements OnInit {
  listFilter: string;

  constructor(private route: ActivatedRoute) { }

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