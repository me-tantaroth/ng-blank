import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

import { SlideService } from '../../core/slides/services/slide.service';

import { Slide } from '../../core/slides/models/slide';

@Component({
  selector: 'app-slideshow-plugin',
  templateUrl: './slideshow-plugin.component.html',
  styleUrls: ['./slideshow-plugin.component.scss']
})
export class SlideshowPluginComponent implements OnInit {
  @Input() filter: string;

  panelOpenState: boolean;
  slides: Observable<Slide[]>;

  constructor(private slideService: SlideService) {}

  ngOnInit() {
    // this.slides = this.slideService.list().pipe(
    //   map((slides: Slide[]) =>
    //     _.filter(slides, (o) => {
    //       let match: boolean;

    //       if (this.filter) {
    //         match = o[this.filter] === !!this.filter;
    //       } else {
    //         match = o.deleted === false;
    //       }

    //       return match;
    //     })
    //   )
    // );
  }
}
