import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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

  ObjectKeys = Object.keys;
  panelOpenState: boolean;
  slides: Observable<Slide[]>;

  constructor(private router: Router, private slideService: SlideService) {}

  ngOnInit() {
    this.slides = this.slideService.list('|list');
  }

  goTo(slide: Slide) {
    if (slide.url) {
      if (slide.externalURL) {
        window.open(slide.url);
      } else {
        this.router.navigate([slide.url]);
      }
    }
  }
}
