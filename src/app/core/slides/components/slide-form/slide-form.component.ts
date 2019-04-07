import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { SlideService } from '../../services/slide.service';

import { Slide, Slides } from '../../models/slide';
import { Message } from '../../../../models/message';

@Component({
  selector: 'app-slide-form',
  templateUrl: './slide-form.component.html',
  styleUrls: ['./slide-form.component.scss']
})
export class SlideFormComponent implements OnInit {
  @Input() slide: Slide;
  @Input() uid: string;

  events: string[] = [];
  slides: Observable<Slides>;
  submitted: boolean;
  form: FormGroup;
  editing: boolean;
  message: Message = {
    show: false
  };
  errorMessages: any;

  constructor(
    private store: StoreService,
    private slideService: SlideService,
    private router: Router
  ) {
    this.store.select('slides');
  }

  get f(): any {
    return this.form.controls;
  }

  ngOnInit() {
    this.slides = this.slideService.list();

    this.errorMessages = {
      image: {
        required: 'La foto de perfíl es requerida.'
      }
    };

    this.form = new FormGroup({
      uid: new FormControl(),
      title: new FormControl(''),
      subtitle: new FormControl(''),
      url: new FormControl(''),
      image: new FormControl('', Validators.required),
      externalURL: new FormControl(false),
      blocked: new FormControl(true),
      deleted: new FormControl(false),
      deletedCount: new FormControl(0)
    });

    if (this.uid) {
      this.slideService
        .getItem('|' + this.uid)
        .subscribe((slide: Slide) => {
          if (slide) {
            this.form.patchValue({
              uid: slide.uid,
              title: slide.title,
              subtitle: slide.subtitle,
              url: slide.url,
              image: slide.image,
              externalURL: slide.externalURL,
              blocked: slide.blocked,
              deleted: slide.deleted,
              deletedCount: slide.deletedCount
            });
          } else {
            console.error('>> Not found slide item');
          }
        })
        .unsubscribe();
    }
  }

  reset() {
    this.form.reset();
  }

  errors(controlField: string) {
    return Object.keys(this.f[controlField].errors);
  }

  onFilesChanged(files) {
    const reader = new FileReader();

    reader.readAsDataURL(files[0]);

    reader.onload = (event: any) => {
      this.form.patchValue({
        image: event.target.result
      });
    };
  }

  onSubmitting(event: any) {
    this.message = {
      show: false
    };

    const value = event[event.index];
    const slide: Slide = new Slide(value);

    if (!this.uid) {
      slide.dbPath = '|enabled';
    }

    this.slideService
      .setItem('|enabled|' + slide.uid, slide)
      .subscribe((status: boolean) => {
        if (status) {
          this.message = {
            show: true,
            label: 'Info',
            sublabel: 'Slide editado',
            color: 'accent',
            icon: 'info'
          };

          this.router.navigate(['/admin/slide/list']);
        }
      })
      .unsubscribe();

    this.reset();
  }
  onSubmitted(event: boolean) {
    this.submitted = true;

    if (event) {
      this.submitted = false;
    } else {
      this.submitted = false;
    }
  }
}
