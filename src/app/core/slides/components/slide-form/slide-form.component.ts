import { Component, OnInit, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  NgControlStatus
} from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';
import * as _moment from 'moment';
import { Observable } from 'rxjs';

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
  @Input() action: string;
  @Input() path: string;

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
      currentPath: new FormControl(''),
      dbPath: new FormControl(''),
      image: new FormControl('', Validators.required),
      externalURL: new FormControl(false),
      blocked: new FormControl(true),
      deleted: new FormControl(false),
      deletedCount: new FormControl(0)
    });

    console.log(this.action);
    if (this.action === 'edit') {
      console.log(this.slide);

      this.form.patchValue(this.slide);
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

    console.log(slide);
    if (!this.path) {
      slide.dbPath = '|enabled';
      slide.currentPath = '|enabled' + slide.uid;
    }

    this.slideService
      .setItem('|enabled|' + slide.uid, slide)
      .subscribe((status: boolean) => {
        if (status) {
          this.message = {
            show: true,
            label: 'Info',
            sublabel: 'Slide guardado',
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
