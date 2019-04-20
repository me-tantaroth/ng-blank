import {
  Component,
  ViewChild,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';
import * as _moment from 'moment';
import { Observable } from 'rxjs';

import { Accents } from '../../../../shared/utils';

declare var $: any;

import {
  StorageService,
  FileUploaded
} from '../../../services/storage.service';
import { PageService } from '../../services/page.service';

import { Page } from '../../models/page';
import { Message } from '../../../../models/message';

@Component({
  selector: 'app-page-form',
  templateUrl: './page-form.component.html',
  styleUrls: ['./page-form.component.scss'],
  providers: []
})
export class PageFormComponent implements OnInit, OnChanges {
  @ViewChild('froalaEditor') froalaEditor;
  @Input() page: Page;
  @Input() filter: string;
  @Input() value: string;

  fileUploaded: Observable<FileUploaded>;
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
    private afs: AngularFirestore,
    private store: StoreService,
    private storageService: StorageService,
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
      image: {
        required: 'La foto de perfíl es requerida.'
      }
    };
    this.form = new FormGroup({
      uuid: new FormControl(''),
      name: new FormControl('', Validators.required),
      text: new FormControl(''),
      description: new FormControl(''),
      keywords: new FormControl(''),
      content: new FormControl(''),
      image: new FormControl(''),
      customPath: new FormControl(''),
      backPath: new FormControl(''),
      absolutePath: new FormControl(''),
      type: new FormControl(),
      size: new FormControl(''),
      lastModifiedDate: new FormControl(''),
      url: new FormControl(''),
      postedAt: new FormControl(new Date()),
      root: new FormControl(true),
      blocked: new FormControl(true),
      deleted: new FormControl(false)
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.page.currentValue) {
      if (this.filter.search('edit') >= 0) {
        changes.page.currentValue.postedAt = changes.page.currentValue.postedAt.toDate();

        this.form.patchValue(changes.page.currentValue);
      }
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
      url:
        '/' +
        new Accents()
          .removeDiacritics(event.target.value)
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[-\/\\^$*+?.()|[\]{}]/g, '')
    });
  }

  onFilesChanged(files) {
    const file = files[0];

    if (files && files.length && files.length > 0) {
      if (file.type.search('image/') >= 0) {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = (event: any) => {
          // UPLOAD FILE TO FIRESTORAGE
          // GET DOWNLOAD URL AND ADD THIS URL TO FORM LINK
          this.form.patchValue({
            type: file.type,
            size: file.size,
            lastModifiedDate: file.lastModifiedDate,
            image: event.target.result
          });
        };
      }

      this.fileUploaded = this.storageService.uploadFile(file);
      this.fileUploaded.subscribe((fileUploaded: FileUploaded) => {
        if (fileUploaded.downloadURL) {
          fileUploaded.downloadURL.subscribe((url) => {
            const response = {
              externalURL: true,
              image: null,
              type: file.type,
              size: file.size,
              lastModifiedDate: file.lastModifiedDate
            };
            if (file.type.search('image/') >= 0) {
              response.image = url;
            }
            this.form.patchValue(response);
          });
        }
      });
    }
  }

  onSubmitting(event: any) {
    this.message = {
      show: false
    };

    const value = event[event.index];
    const page: Page = new Page(value);

    page.text = page.name;

    if (this.filter.search('edit') >= 0) {
      page.customPath = this.value + '|list';

      this.pageService.setItem(this.value, page).subscribe(() => {
        this.message = {
          show: true,
          label: 'Info',
          sublabel: 'Guardado',
          color: 'accent',
          icon: 'info'
        };
      });
    } else if (this.filter.search('add') >= 0) {
      page.absolutePath =
        '/projects/blank-fire/langs/es/modules/drive/list/' + page.uuid;

      if (this.value) {
        page.uuid = this.afs.createId();
        page.customPath = this.value + '|list|' + page.uuid + '|list';
        page.backPath = this.value + '|list';
        page.root = true;
        page.absolutePath = `/projects/blank-fire/langs/es/modules/drive${this.value
          .split('|')
          .join('/')}/list/${page.uuid}`;

        this.pageService
          .setItem(this.value + '|list|' + page.uuid, page)
          .subscribe(() => {
            this.message = {
              show: true,
              label: 'Info',
              sublabel: 'Guardado',
              color: 'accent',
              icon: 'info'
            };
          });
      } else {
        page.uuid = this.afs.createId();
        page.customPath = '|list|' + page.uuid + '|list';
        page.backPath = '|list';
        page.root = true;

        this.pageService.setItem('|list|' + page.uuid, page).subscribe(() => {
          this.message = {
            show: true,
            label: 'Info',
            sublabel: 'Guardado',
            color: 'accent',
            icon: 'info'
          };
        });
      }
    } else {
      page.uuid = this.afs.createId();
      page.customPath = '|list|' + page.uuid + '|list';
      page.backPath = '|list';
      page.root = true;

      this.pageService.setItem('|list|' + page.uuid, page).subscribe(() => {
        this.message = {
          show: true,
          label: 'Info',
          sublabel: 'Archivo guardado',
          color: 'accent',
          icon: 'info'
        };
      });
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
