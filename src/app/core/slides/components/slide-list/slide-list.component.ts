import { Component, OnInit, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';
import * as _ from 'lodash';

import { SlideService } from '../../services/slide.service';

import { Slide, Slides } from '../../models/slide';

@Component({
  selector: 'app-slide-list',
  templateUrl: './slide-list.component.html',
  styleUrls: ['./slide-list.component.scss']
})
export class SlideListComponent implements OnInit {
  @Input() filter: string;

  ObjectKeys = Object.keys;
  panelOpenState: boolean;
  slides: Observable<Slides>;

  constructor(private slideService: SlideService) {}

  ngOnInit() {
    this.filter = this.filter || 'enabled';

    this.slides = this.slideService.list('|' + this.filter);
  }

  blockSlide(path: string, slide: Slide) {
    slide.blocked = true;

    this.slideService
      .setItem(path, slide)
      .pipe(first())
      .subscribe((status: boolean) => {
        if (status) {
          this.slideService
            .removeItem('|enabled|' + slide.uid)
            .pipe(first())
            .subscribe((statusEnabled: boolean) => {
              if (statusEnabled) {
                this.slides = this.slideService.list('|enabled');
              }
            });
        }
      });
  }

  unBlockSlide(path: string, slide: Slide) {
    slide.blocked = false;

    this.slideService
      .setItem(path, slide)
      .pipe(first())
      .subscribe((status: boolean) => {
        if (status) {
          this.slideService
            .removeItem('|blocked|' + slide.uid)
            .pipe(first())
            .subscribe((statusRemoved: boolean) => {
              if (statusRemoved) {
                this.slides = this.slideService.list('|blocked');
              }
            });
        }
      });
  }

  deleteSlide(path: string, slide: Slide) {
    if (confirm(`Seguro que desea eliminar a '${slide.title}'?`)) {
      slide.deleted = true;

      this.slideService
        .setItem(path, slide)
        .pipe(first())
        .subscribe((status: boolean) => {
          if (status) {
            this.slideService
              .removeItem('|enabled|' + slide.uid)
              .pipe(first())
              .subscribe((statusEnabled: boolean) => {
                if (statusEnabled) {
                  this.slides = this.slideService.list('|enabled');
                }
              });
          }
        });
    }
  }

  unDeletedSlide(path: string, slide: Slide) {
    slide.deleted = false;

    this.slideService
      .setItem(path, slide)
      .pipe(first())
      .subscribe((status: boolean) => {
        if (status) {
          this.slideService
            .removeItem('|deleted|' + slide.uid)
            .pipe(first())
            .subscribe((statusDeleted: boolean) => {
              if (statusDeleted) {
                this.slides = this.slideService.list('|deleted');
              }
            });
        }
      });
  }
}
