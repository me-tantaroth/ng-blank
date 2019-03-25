import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';
import * as _moment from 'moment';
import { Observable } from 'rxjs';

import {
  SlideService,
  ServiceResponse as SlideServiceResponse
} from '../../services/slide.service';

import { Slide } from '../../models/slide';
import { Message } from '../../../../models/message';

@Component({
  selector: 'app-slide-form',
  templateUrl: './slide-form.component.html',
  styleUrls: ['./slide-form.component.scss']
})
export class SlideFormComponent implements OnInit {
  @Input() slide: Slide;
  @Input() id: string;

  events: string[] = [];
  slides: Observable<Slide[]>;
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
    store.select('slides');
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
      title: new FormControl('', Validators.required),
      subtitle: new FormControl(''),
      redirect: new FormControl(''),
      image: new FormControl('', Validators.required),
      blocked: new FormControl(true),
      deleted: new FormControl(false)
    });

    console.log(this.id);
    if (this.id) {
      this.slideService
        .get(this.id)
        .subscribe((slideResponse: SlideServiceResponse) => {
          if (slideResponse) {
            const slide: Slide = slideResponse.value;

            this.form.patchValue({
              title: slide.title,
              subtitle: slide.subtitle,
              redirect: slide.redirect,
              image: slide.image,
              blocked: slide.blocked,
              deleted: slide.deleted
            });
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

    if (this.id) {
      this.slideService
        .set(this.id, new Slide(value))
        .subscribe((slideResponse: SlideServiceResponse) => {
          if (slideResponse) {
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
    } else {
      this.slideService
        .push(new Slide(value))
        .subscribe((slideResponse: SlideServiceResponse) => {
          if (slideResponse) {
            this.message = {
              show: true,
              label: 'Info',
              sublabel: 'Slide creado',
              color: 'accent',
              icon: 'info'
            };
          }
        })
        .unsubscribe();
    }
  }
  onSubmitted(event: boolean) {
    this.submitted = true;

    if (event) {
      this.submitted = false;
      this.reset();
    } else {
      this.submitted = false;
    }
  }
}
