import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { Observable } from 'rxjs';

import { Accents } from '../../../../shared/utils/accents';

declare var $: any;

import {
  PageService,
  ServiceResponse as PageServiceResponse
} from '../../services/page.service';

import { Page } from '../../models/page';
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
  @Input() uid: string;

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
      uid: new FormControl(),
      index: new FormControl(),
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

    if (this.uid) {
      this.pageService
        .filter({ uid: this.uid })
        .subscribe((pages: Page[]) => {
          if (pages && pages.length > 0 && pages.length === 1) {
            const page: Page = pages[0];

            this.form.patchValue({
              uid: page.uid,
              index: page.index,
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
    }

    $.FroalaEditor.DefineIcon('customHTML', { NAME: 'code' });
    $.FroalaEditor.RegisterCommand('customHTML', {
      title: 'Hello',
      focus: false,
      undo: false,
      refreshAfterCallback: false,

      callback: () => {
        $(this.froalaEditor.nativeElement).froalaEditor(
          'html.set',
          '<p>asdsad</p><prueba>sassdf</prueba>',
          false
        );

        $.FroalaEditor.MODULES.data = (p) => {
          const w: any = window;
          p.events.on('html.set', () => {
            alert('HTML SET');
            var e=p.el.querySelector('[data-f-id="pbf"]');
            e&&w(e).remove()
          });
        };

        console.log(
          $.FroalaEditor.MODULES,
          this.froalaEditor.nativeElement,
          '***',
          $(this.froalaEditor.nativeElement).froalaEditor('html.get')
        );
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

    if (this.uid) {
      this.pageService
        .set({ uid: this.uid }, new Page(value))
        .subscribe((pageResponse: PageServiceResponse) => {
          if (pageResponse) {
            this.message = {
              show: true,
              label: 'Info',
              sublabel: 'Página editada',
              color: 'accent',
              icon: 'info'
            };

            this.router.navigate(['/admin/page/list']);
          }
        })
        .unsubscribe();
    } else {
      value.index = event.index;

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

            this.router.navigate(['/admin/page/list']);
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
