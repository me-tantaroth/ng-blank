import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

import { SlideService } from '../../services/slide.service';

import { Slide } from '../../models/slide';

@Component({
  selector: 'app-slide-list',
  templateUrl: './slide-list.component.html',
  styleUrls: ['./slide-list.component.scss']
})
export class SlideListComponent implements OnInit {
  @Input() filter: string;

  panelOpenState: boolean;
  slides: Observable<Slide[]>;

  constructor(private slideService: SlideService) {}

  ngOnInit() {
    this.slides = this.slideService.list().pipe(
      map((slides: Slide[]) =>
        _.filter(slides, (o) => {
          let match: boolean;

          if (this.filter) {
            match = o[this.filter] === !!this.filter;
          } else {
            match = o.deleted === false;
          }

          return match;
        })
      )
    );
  }

  blockSlide(uid: string, slide: Slide) {
    slide.blocked = true;

    this.slideService.set({ uid }, slide);
  }

  deleteSlide(uid: string, slide: Slide) {
    slide.deleted = true;

    this.slideService.set({ uid }, slide);
  }
}
