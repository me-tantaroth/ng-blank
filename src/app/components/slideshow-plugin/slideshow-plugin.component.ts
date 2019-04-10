import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { SlideService } from '../../core/slides/services/slide.service';

import { Slides } from '../../core/slides/models/slide';

@Component({
  selector: 'app-slideshow-plugin',
  templateUrl: './slideshow-plugin.component.html',
  styleUrls: ['./slideshow-plugin.component.scss']
})
export class SlideshowPluginComponent implements OnInit {
  @Input() filter: string;

  ObjectKeys = Object.keys;
  panelOpenState: boolean;
  slides: Observable<Slides>;

  constructor(private slideService: SlideService) {}

  ngOnInit() {
    this.slides = this.slideService.list();
  }
}
