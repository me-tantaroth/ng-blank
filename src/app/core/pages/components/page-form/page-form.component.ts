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
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';
import * as _moment from 'moment';
import { Observable, combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';

import { Accents } from '../../../../shared/utils';

declare var $: any;

import {
  StorageService,
  FileUploaded
} from '../../../services/storage.service';
import { ModulesService } from '../../../modules/services/modules.service';
import { UsersService } from '../../../users/services/users.service';
import { PageService } from '../../services/page.service';

import { Module } from 'src/app/core/modules/models/module';
import { User } from 'src/app/core/users/models/user';
import { Page } from '../../models/page';
import { Message } from '../../../../models/message';

@Component({
  selector: 'app-page-form',
  templateUrl: './page-form.component.html',
  styleUrls: ['./page-form.component.scss'],
  providers: []
})
export class PageFormComponent implements OnInit, OnChanges {
  public static storage = 'hoas';

  @ViewChild('froalaEditor') froalaEditor;
  @Input() page: Page;
  @Input() filter: string;
  @Input() value: string;

  uuid: string;
  ref: string;
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
    htmlAllowedAttrs: ['.*'],
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
      'froalaEditor.image.beforeUpload': function(e, editor, images) {
        for (const image of images) {
          $._storageService
            .uploadFile(image)
            .subscribe((fileUploaded: FileUploaded) => {
              if (fileUploaded.downloadURL) {
                fileUploaded.downloadURL.subscribe((url) => {
                  if (url) {
                    editor.image.insert(
                      `<iframe src="${url}"> <p>Your browser does not support iframes.</p> </iframe>`
                    );
                  }
                });
              }
            });
        }

        return false;
      },
      'froalaEditor.video.beforeUpload': function(e, editor, videos) {
        for (const video of videos) {
          $._storageService
            .uploadFile(video)
            .subscribe((fileUploaded: FileUploaded) => {
              if (fileUploaded.downloadURL) {
                fileUploaded.downloadURL.subscribe((url) => {
                  if (url) {
                    editor.video.insert(
                      `<iframe src="${url}"> <p>Your browser does not support iframes.</p> </iframe>`
                    );
                  }
                });
              }
            });
        }

        return false;
      },
      'froalaEditor.file.beforeUpload': function(e, editor, files) {
        for (const file of files) {
          $._storageService
            .uploadFile(file)
            .subscribe((fileUploaded: FileUploaded) => {
              if (fileUploaded.downloadURL) {
                fileUploaded.downloadURL.subscribe((url) => {
                  if (url) {
                    editor.file.insert(
                      `<iframe src="${url}"> <p>Your browser does not support iframes.</p> </iframe>`
                    );
                  }
                });
              }
            });
        }

        return false;
      }
    }
  };

  constructor(
    private afs: AngularFirestore,
    private store: StoreService,
    private storageService: StorageService,
    private modulesService: ModulesService,
    private usersService: UsersService,
    private pageService: PageService,
    private router: Router
  ) {
    this.store.select('pages');
  }

  get f(): any {
    return this.form.controls;
  }

  ngOnInit() {
    $._storageService = this.storageService;
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
        if (changes.page.currentValue) {
          changes.page.currentValue.postedAt = changes.page.currentValue.postedAt.toDate();
        }

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
        '/page/' +
        new Accents()
          .removeDiacritics(event.target.value)
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[-\/\\^$*+?.()|[\]{}]/g, '')
    });
  }

  goTo(url, e) {
    console.log(url, e);
    e.stopPropagation();
    e.preventDefault();

    window.open(url);
  }

  onFilesChanged(files) {
    const file = files[0];

    this.submitted = true;

    file.uuid = this.uuid;

    if (files && files.length && files.length > 0) {
      if (file.type.search('image/') >= 0) {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = (event: any) => {
          // UPLOAD FILE TO FIRESTORAGE
          // GET DOWNLOAD URL AND ADD THIS URL TO FORM LINK
          this.form.patchValue({
            name: this.f.name.value || file.name,
            type: file.type,
            size: file.size,
            lastModifiedDate: file.lastModifiedDate,
            previewImage: event.target.result
          });
        };
      } else {
        // UPLOAD FILE TO FIRESTORAGE
        // GET DOWNLOAD URL AND ADD THIS URL TO FORM LINK
      }

      this.fileUploaded = this.storageService.uploadFile(file);
      this.fileUploaded.subscribe((fileUploaded: FileUploaded) => {
        if (fileUploaded.downloadURL) {
          fileUploaded.downloadURL.subscribe((url) => {
            if (url) {
              const response = {
                previewImage: null,
                image: url,
                name: this.f.name.value || file.name,
                text: file.text,
                type: file.type,
                size: file.size,
                lastModifiedDate: file.lastModifiedDate
              };
              if (file.type.search('image/') >= 0) {
                response.previewImage = url;
              }
              this.form.patchValue(response);
              this.submitted = false;
            }
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
    const pageModule$: Observable<Module> = this.modulesService.getItem(
      '|page'
    );
    const currentUser$: Observable<User> = this.usersService.getItem(
      this.store.get('currentUserPermissions').path
    );

    this.ref = '|list|' + this.uuid;

    page.text = page.text || page.name;

    if (this.filter.search('edit') >= 0) {
      this.ref = this.value;
      page.customPath = this.value + '|list';
    } else if (this.filter.search('add') >= 0) {
      page.absolutePath =
        '/projects/blank-fire/langs/es/modules/drive/list/' + page.uuid;

      if (this.value) {
        this.ref = this.value + '|list|' + page.uuid;

        page.uuid = this.uuid;
        page.customPath = this.value + '|list|' + page.uuid + '|list';
        page.backPath = this.value + '|list';
        page.root = true;
        page.absolutePath = `/projects/blank-fire/langs/es/modules/drive${this.value
          .split('|')
          .join('/')}/list/${page.uuid}`;
      } else {
        page.uuid = this.uuid;
        page.customPath = '|list|' + page.uuid + '|list';
        page.backPath = '|list';
        page.root = true;

        this.ref = '|list|' + page.uuid;
      }
    } else {
      page.uuid = this.uuid;
      page.customPath = '|list|' + page.uuid + '|list';
      page.backPath = '|list';
      page.root = true;

      this.ref = '|list|' + page.uuid;
    }

    combineLatest([pageModule$, currentUser$])
      .pipe(first())
      .subscribe(([pageModule, currentUser]) => {
        if (
          (currentUser.permissions.page_write &&
            !currentUser.permissions.page_write_limit) ||
          (currentUser.permissions.page_write &&
            currentUser.permissions.page_write_limit &&
            currentUser.permissions.page_write_limit_max &&
            pageModule.count < currentUser.permissions.page_write_limit_max) ||
          ((this.filter.search('add') >= 0 &&
            currentUser.permissions.page_create &&
            !currentUser.permissions.page_create_limit) ||
            (currentUser.permissions.page_create &&
              currentUser.permissions.page_create_limit &&
              currentUser.permissions.page_create_limit_max &&
              pageModule.count <
                currentUser.permissions.page_create_limit_max)) ||
          ((this.filter.search('edit') >= 0 &&
            currentUser.permissions.page_update &&
            !currentUser.permissions.page_update_limit) ||
            (currentUser.permissions.page_update &&
              currentUser.permissions.page_update_limit &&
              currentUser.permissions.page_update_limit_max &&
              pageModule.count < currentUser.permissions.page_update_limit_max))
        ) {
          this.pageService.setItem(this.ref, page).subscribe(() => {
            if (this.filter.search('add') >= 0) {
              pageModule.count = (pageModule.count || 0) + 1;
            }

            this.modulesService
              .setItem('|page', pageModule)
              .pipe(first())
              .subscribe(() => {
                this.message = {
                  show: true,
                  label: 'Info',
                  sublabel: 'Guardado',
                  color: 'accent',
                  icon: 'info'
                };
              });
          });
        } else {
          this.message = {
            show: true,
            label: 'Error!',
            sublabel: 'Su plan no le permite hacer esta acción!',
            color: 'warn',
            icon: 'error'
          };
        }
      });

    if (this.filter.search('add') >= 0) {
      this.reset();
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
