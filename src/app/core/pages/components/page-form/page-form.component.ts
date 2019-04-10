import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { Observable } from 'rxjs';

import { Accents } from '../../../../shared/utils';

declare var $: any;

import { PageService } from '../../services/page.service';

import { Page, Pages } from '../../models/page';
import { Message } from '../../../../models/message';

@Component({
  selector: 'app-page-form',
  templateUrl: './page-form.component.html',
  styleUrls: ['./page-form.component.scss'],
  providers: []
})
export class PageFormComponent implements OnInit {
  @ViewChild('froalaEditor') froalaEditor;
  @Input() page: Page;
  @Input() filter: string;
  @Input() value: string;

  pages: Observable<Pages>;
  submitted: boolean;
  form: FormGroup;
  editing: boolean;
  message: Message = {
    show: false
  };
  errorMessages: any;
  optionsEditor: Object = {
    htmlAllowedTags: ['.*'],
    charCounterCount: true,
    toolbarButtons: [
      'fullscreen',
      'bold',
      'italic',
      'underline',
      'strikeThrough',
      'subscript',
      'superscript',
      '|',
      'fontFamily',
      'fontSize',
      'color',
      'inlineClass',
      'inlineStyle',
      'paragraphStyle',
      'lineHeight',
      '|',
      'paragraphFormat',
      'align',
      'formatOL',
      'formatUL',
      'outdent',
      'indent',
      'quote',
      '-',
      'insertLink',
      'insertImage',
      'insertVideo',
      'embedly',
      'insertFile',
      'insertTable',
      '|',
      'emoticons',
      'fontAwesome',
      'specialCharacters',
      'insertHR',
      'selectAll',
      'clearFormatting',
      'html',
      '|',
      'print',
      'getPDF',
      'spellChecker',
      'help',
      '|',
      'undo',
      'redo',
      'customHTML'
    ],
    events: {
      'froalaEditor.contentChanged': function(e, editor) {
        // CODE
      }
    }
  };

  constructor(
    private store: StoreService,
    private pageService: PageService,
    private router: Router
  ) {
    this.store.select('pages');
  }

  get f(): any {
    return this.form.controls;
  }

  ngOnInit() {
    this.errorMessages = {
      cover: {
        required: 'La foto de perfíl es requerida.'
      }
    };
    this.form = new FormGroup({
      uid: new FormControl(),
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
      keywords: new FormControl(''),
      content: new FormControl(''),
      cover: new FormControl(''),
      principalPath: new FormControl(''),
      currentPath: new FormControl(''),
      dbPath: new FormControl(''),
      postedAt: new FormControl(),
      externalURL: new FormControl(false),
      blocked: new FormControl(true),
      deleted: new FormControl(false)
    });
    if (this.filter === 'edit') {
      this.form.patchValue(this.page);
    }
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
      principalPath: new Accents()
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
      console.log(event.target.result);
      this.form.patchValue({
        cover: event.target.result
      });
    };
  }

  onSubmitting(event: any) {
    this.message = {
      show: false
    };

    const value = event[event.index];
    const page: Page = new Page(value);

    if (this.filter === 'edit') {
      page.dbPath = '|enabled';
      page.currentPath = '|enabled|' + page.uid;
      page.backPath = this.value;
      page.root = true;

      this.pageService
        .setItem(this.value, page)
        .subscribe((status: boolean) => {
          if (status) {
            this.message = {
              show: true,
              label: 'Info',
              sublabel: 'Página guardado',
              color: 'accent',
              icon: 'info'
            };

            this.router.navigate(['/admin/page/list']);
          }
        })
        .unsubscribe();
    } else if (this.filter === 'add') {
      if (this.value) {
        page.dbPath = this.value + '|enabled';
        page.currentPath = this.value + '|enabled|' + page.uid;
        page.backPath = this.value;
        page.root = true;

        this.pageService
          .setItem(this.value + '|enabled|' + page.uid, page)
          .subscribe((status: boolean) => {
            if (status) {
              this.message = {
                show: true,
                label: 'Info',
                sublabel: 'Página guardado',
                color: 'accent',
                icon: 'info'
              };

              this.router.navigate(['/admin/page/list']);
            }
          })
          .unsubscribe();
      } else {
        page.dbPath = '|enabled';
        page.currentPath = '|enabled|' + page.uid;
        page.backPath = '';
        page.root = true;

        this.pageService
          .setItem('|enabled|' + page.uid, page)
          .subscribe((status: boolean) => {
            if (status) {
              this.message = {
                show: true,
                label: 'Info',
                sublabel: 'Página guardado',
                color: 'accent',
                icon: 'info'
              };

              this.router.navigate(['/admin/page/list']);
            }
          })
          .unsubscribe();
      }
    } else {
      page.dbPath = '|enabled';
      page.currentPath = '|enabled|' + page.uid;
      page.backPath = '';
      page.root = true;

      this.pageService
        .setItem('|enabled|' + page.uid, page)
        .subscribe((status: boolean) => {
          if (status) {
            this.message = {
              show: true,
              label: 'Info',
              sublabel: 'Página guardado',
              color: 'accent',
              icon: 'info'
            };

            this.router.navigate(['/admin/page/list']);
          }
        })
        .unsubscribe();
    }

    this.reset();
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
