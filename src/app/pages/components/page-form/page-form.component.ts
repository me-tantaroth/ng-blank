import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { Observable } from 'rxjs';

import { Accents } from '../../../shared/utils/accents';

declare var $: any;

import {
  PageService,
  ServiceResponse as PageServiceResponse
} from '../../services/page.service';

import { Page } from '../../models/page';
import { Message } from '../../../models/message';

@Component({
  selector: 'app-page-form',
  templateUrl: './page-form.component.html',
  styleUrls: ['./page-form.component.scss'],
  providers: []
})
export class PageFormComponent implements OnInit {
  @Input() page: Page;
  @Input() id: string;

  events: string[] = [];
  pages: Observable<Page[]>;
  submitted: boolean;
  form: FormGroup;
  editing: boolean;
  message: Message = {
    show: false
  };
  errorMessages: any;
  optionsEditor: Object = {
    charCounterCount: true,
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert'],
    toolbarButtonsXS: [
      'bold',
      'italic',
      'underline',
      'paragraphFormat',
      'alert'
    ],
    toolbarButtonsSM: [
      'bold',
      'italic',
      'underline',
      'paragraphFormat',
      'alert'
    ],
    toolbarButtonsMD: [
      'bold',
      'italic',
      'underline',
      'paragraphFormat',
      'alert'
    ]
  };

  constructor(
    private store: StoreService,
    private pageService: PageService,
    private router: Router
  ) {
    store.select('pages');
  }

  get f(): any {
    return this.form.controls;
  }

  ngOnInit() {
    this.pages = this.pageService.list();

    this.errorMessages = {
      image: {
        required: 'La foto de perfíl es requerida.'
      }
    };

    this.form = new FormGroup({
      path: new FormControl(''),
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
      keywords: new FormControl(''),
      content: new FormControl(''),
      image: new FormControl(''),
      postedAt: new FormControl(new Date().toISOString()),
      blocked: new FormControl(true),
      deleted: new FormControl(false)
    });

    if (this.id) {
      this.pageService
        .get(this.id)
        .subscribe((pageResponse: PageServiceResponse) => {
          if (pageResponse) {
            const page: Page = pageResponse.value;

            this.form.patchValue({
              path: page.path,
              title: page.title,
              description: page.description,
              keywords: page.keywords,
              content: page.content,
              image: page.image,
              postedAt: page.postedAt,
              blocked: page.blocked,
              deleted: page.deleted
            });
          }
        })
        .unsubscribe();
    } else if (this.page) {
      const page: Page = this.page;

      this.form.patchValue({
        path: page.path,
        title: page.title,
        description: page.description,
        keywords: page.keywords,
        content: page.content,
        image: page.image,
        postedAt: page.postedAt,
        blocked: page.blocked,
        deleted: page.deleted
      });
    }

    $.FroalaEditor.DefineIcon('alert', { NAME: 'info' });
    $.FroalaEditor.RegisterCommand('alert', {
      title: 'Hello',
      focus: false,
      undo: false,
      refreshAfterCallback: false,

      callback: () => {
        alert('Hello!');
      }
    });
  }

  reset() {
    this.form.reset();
  }

  errors(controlField: string) {
    return Object.keys(this.f[controlField].errors);
  }

  onDateChanged(event: MatDatepickerInputEvent<Date>) {
    this.form.patchValue({
      postedAt: event.value
    });
  }

  onPathChanged(event) {
    this.form.patchValue({
      path: new Accents()
        .removeDiacritics(event.target.value)
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[-\/\\^$*+?.()|[\]{}]/g, '')
    });
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

    console.log('VALUE', value);

    if (this.id) {
      this.pageService
        .set(this.id, new Page(value))
        .subscribe((pageResponse: PageServiceResponse) => {
          if (pageResponse) {
            this.message = {
              show: true,
              label: 'Info',
              sublabel: 'Página editada',
              color: 'accent',
              icon: 'info'
            };

            this.router.navigate(['/page/list']);
          }
        })
        .unsubscribe();
    } else {
      this.pageService
        .push(new Page(value))
        .subscribe((pageResponse: PageServiceResponse) => {
          if (pageResponse) {
            this.message = {
              show: true,
              label: 'Info',
              sublabel: 'Página creada',
              color: 'accent',
              icon: 'info'
            };
          }
        })
        .unsubscribe();
    }
  }
  onSubmitted(event: boolean) {
    console.log('SUBMIT', event);
    this.submitted = true;

    if (event) {
      this.submitted = false;
      this.reset();
    } else {
      this.submitted = false;
    }
  }
}
