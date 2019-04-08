import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Observable } from 'rxjs';
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

  constructor(private slideService: SlideService, private router: Router) {
    router.events.subscribe((data) => {
      if (data instanceof ActivationEnd) {
        if (!!data.snapshot.params.filter) {
          this.filter = data.snapshot.params.filter;

          this.slides = this.slideService.list('|' + this.filter);
        }
      }
    });
  }

  ngOnInit() {
    this.filter = this.filter || 'enabled';

    this.slides = this.slideService.list('|' + this.filter);
  }

  onBlockSlide(path: string, slide: Slide) {
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

  onUnBlockSlide(path: string, slide: Slide) {
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

  onDeleteSlide(path: string, slide: Slide) {
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

  onUnDeletedSlide(path: string, slide: Slide) {
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
