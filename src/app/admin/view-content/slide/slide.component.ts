import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';
import { Observable } from 'rxjs';

import { SlideService } from '../../../core/slides/services/slide.service';

import { Slide } from '../../../core/slides/models/slide';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss']
})
export class SlideComponent implements OnInit {
  slide: Observable<Slide>;
  filter: string;
  value: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private slideService: SlideService
  ) {
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
    const value = this.route.snapshot.paramMap.get('value');

    if (value) {
      const valueParser = value.split('|');

      valueParser.pop();

      this.value = valueParser.join('|');

      this.slide = this.slideService.getItem(valueParser.join('|'));
    } else {
      this.route.paramMap
        .subscribe((params) => {
          if (params.get('value')) {
            const valueParser = params.get('value').split('|');

            valueParser.pop();

            this.value = valueParser.join('|');

            this.slide = this.slideService.getItem(valueParser.join('|'));
          }
        })
        .unsubscribe();
    }

    const filter = this.route.snapshot.paramMap.get('filter');

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
