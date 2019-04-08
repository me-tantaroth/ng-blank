import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { Slide } from '../../../core/slides/models/slide';
import { SlideService } from '../../../core/slides/services/slide.service';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss']
})
export class SlideComponent implements OnInit {
  slide: Slide;
  path: string;
  filter: string;

  constructor(
    private route: ActivatedRoute,
    private slideService: SlideService
  ) {}

  ngOnInit() {
    const value = this.route.snapshot.paramMap.get('value');

    if (value) {
      this.path = value;

      this.slideService
        .getItem(value)
        .subscribe((slide: Slide) => (this.slide = slide))
        .unsubscribe();
    } else {
      this.route.paramMap
        .subscribe((params) => {
          const value = params.get('value');
          if (value) {
            this.path = value;

            this.slideService
              .getItem(value)
              .pipe(first())
              .subscribe((slide: Slide) => (this.slide = slide));
          }
        })
        .unsubscribe();
    }

    const filter = this.route.snapshot.paramMap.get('filter');

    console.log(filter, 'asdasd')
    if (filter) {
      this.filter = filter;
    } else {
      this.filter = 'add';

      this.route.paramMap
        .subscribe((params) => {
          if (params.get('filter')) {
            this.filter = params.get('filter');
          }
        })
        .unsubscribe();
    }
  }
}
