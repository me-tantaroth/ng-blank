import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';
import * as _moment from 'moment';
import { Observable, combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';

import {
  StorageService,
  FileUploaded
} from '../../../services/storage.service';
import { ModulesService } from '../../../modules/services/modules.service';
import { SlideService } from '../../services/slide.service';
import { UserService } from '../../../users/services/user.service';

import { Slide } from '../../models/slide';
import { Message } from '../../../../models/message';
import { Module } from 'src/app/core/modules/models/module';
import { User } from 'src/app/core/users/models/user';

@Component({
  selector: 'app-slide-form',
  templateUrl: './slide-form.component.html',
  styleUrls: ['./slide-form.component.scss']
})
export class SlideFormComponent implements OnInit, OnChanges {
  @Input() slide: Slide;
  @Input() filter: string;
  @Input() value: string;

  uuid: string;
  ref: string;
  fileUploaded: Observable<FileUploaded>;
  slides: Observable<Slide[]>;
  submitted: boolean;
  form: FormGroup;
  editing: boolean;
  message: Message = {
    show: false
  };
  errorMessages: any;

  constructor(
    private afs: AngularFirestore,
    private store: StoreService,
    private storageService: StorageService,
    private modulesService: ModulesService,
    private slideService: SlideService,
    private userService: UserService,
    private router: Router
  ) {
    this.store.select('slides');
  }

  get f(): any {
    return this.form.controls;
  }

  ngOnInit() {
    this.uuid = this.afs.createId();

    this.errorMessages = {
      image: {
        required: 'La foto de perfíl es requerida.'
      }
    };

    this.form = new FormGroup({
      uuid: new FormControl(''),
      name: new FormControl('', Validators.required),
      text: new FormControl(''),
      subtitle: new FormControl(''),
      image: new FormControl(''),
      customPath: new FormControl(''),
      backPath: new FormControl(''),
      absolutePath: new FormControl(''),
      url: new FormControl(''),
      externalURL: new FormControl(false),
      postedAt: new FormControl(new Date()),
      root: new FormControl(true),
      blocked: new FormControl(true),
      deleted: new FormControl(false)
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.slide.currentValue) {
      if (this.filter.search('edit') >= 0) {
        if (changes.slide.currentValue.postedAt) {
          changes.slide.currentValue.postedAt = changes.slide.currentValue.postedAt.toDate();
        }

        this.form.patchValue(changes.slide.currentValue);
      }
    }
  }

  reset() {
    this.form.reset();
  }

  errors(controlField: string) {
    return Object.keys(this.f[controlField].errors);
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
    const slide: Slide = new Slide(value);
    const slideModule$: Observable<Module> = this.modulesService.getItem(
      '|slide'
    );
    const currentUser$: Observable<User> = this.userService.getItem(
      this.store.get('currentUserPermissions').path
    );

    this.ref = '|list|' + this.uuid;

    slide.text = slide.text || slide.name;

    if (this.filter.search('edit') >= 0) {
      this.ref = this.value;
      slide.customPath = this.value + '|list';
    } else if (this.filter.search('add') >= 0) {
      slide.absolutePath =
        '/projects/blank-fire/langs/es/modules/drive/list/' + slide.uuid;

      if (this.value) {
        this.ref = this.value + '|list|' + slide.uuid;

        slide.uuid = this.uuid;
        slide.customPath = this.value + '|list|' + slide.uuid + '|list';
        slide.backPath = this.value + '|list';
        slide.root = true;
        slide.absolutePath = `/projects/blank-fire/langs/es/modules/drive${this.value
          .split('|')
          .join('/')}/list/${slide.uuid}`;
      } else {
        slide.uuid = this.uuid;
        slide.customPath = '|list|' + slide.uuid + '|list';
        slide.backPath = '|list';
        slide.root = true;

        this.ref = '|list|' + slide.uuid;
      }
    } else {
      slide.uuid = this.uuid;
      slide.customPath = '|list|' + slide.uuid + '|list';
      slide.backPath = '|list';
      slide.root = true;

      this.ref = '|list|' + slide.uuid;
    }

    combineLatest([slideModule$, currentUser$])
      .pipe(first())
      .subscribe(([slideModule, currentUser]) => {
        slideModule.count = slideModule.count || 0;

        if (
          (currentUser.permissions.slide_write &&
            !currentUser.permissions.slide_write_limit) ||
          (currentUser.permissions.slide_write &&
            currentUser.permissions.slide_write_limit &&
            currentUser.permissions.slide_write_limit_max &&
            slideModule.count <
              currentUser.permissions.slide_write_limit_max) ||
          ((this.filter.search('add') >= 0 &&
            currentUser.permissions.slide_create &&
            !currentUser.permissions.slide_create_limit) ||
            (currentUser.permissions.slide_create &&
              currentUser.permissions.slide_create_limit &&
              currentUser.permissions.slide_create_limit_max &&
              slideModule.count <
                currentUser.permissions.slide_create_limit_max)) ||
          ((this.filter.search('edit') >= 0 &&
            currentUser.permissions.slide_update &&
            !currentUser.permissions.slide_update_limit) ||
            (currentUser.permissions.slide_update &&
              currentUser.permissions.slide_update_limit &&
              currentUser.permissions.slide_update_limit_max &&
              slideModule.count <
                currentUser.permissions.slide_update_limit_max))
        ) {
          this.slideService.setItem(this.ref, slide).subscribe(() => {
            if (this.filter.search('add') >= 0) {
              slideModule.count = (slideModule.count || 0) + 1;
            }

            this.modulesService
              .setItem('|slide', slideModule)
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
            sublabel: 'No tiene los permisos suficientes para hacer esta acción!',
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
    } else {
      this.submitted = false;
    }
  }
}
