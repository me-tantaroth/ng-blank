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

import {
  StorageService,
  FileUploaded
} from '../../../services/storage.service';
import { SlideService } from '../../services/slide.service';

import { Slide } from '../../models/slide';
import { Message } from '../../../../models/message';

@Component({
  selector: 'app-slide-form',
  templateUrl: './slide-form.component.html',
  styleUrls: ['./slide-form.component.scss']
})
export class SlideFormComponent implements OnInit, OnChanges {
  @Input() slide: Slide;
  @Input() filter: string;
  @Input() value: string;

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

        console.log('>>>', changes.slide.currentValue)

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
    const slide: Slide = new Slide(value);

    slide.text = slide.name;

    if (this.filter.search('edit') >= 0) {
      slide.customPath = this.value + '|list';

      this.slideService.setItem(this.value, slide).subscribe(() => {
        this.message = {
          show: true,
          label: 'Info',
          sublabel: 'Guardado',
          color: 'accent',
          icon: 'info'
        };
      });
    } else if (this.filter.search('add') >= 0) {
      slide.absolutePath =
        '/projects/blank-fire/langs/es/modules/drive/list/' + slide.uuid;

      if (this.value) {
        slide.uuid = this.afs.createId();
        slide.customPath = this.value + '|list|' + slide.uuid + '|list';
        slide.backPath = this.value + '|list';
        slide.root = true;
        slide.absolutePath = `/projects/blank-fire/langs/es/modules/drive${this.value
          .split('|')
          .join('/')}/list/${slide.uuid}`;

        this.slideService
          .setItem(this.value + '|list|' + slide.uuid, slide)
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
        slide.uuid = this.afs.createId();
        slide.customPath = '|list|' + slide.uuid + '|list';
        slide.backPath = '|list';
        slide.root = true;

        this.slideService
          .setItem('|list|' + slide.uuid, slide)
          .subscribe(() => {
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
      slide.uuid = this.afs.createId();
      slide.customPath = '|list|' + slide.uuid + '|list';
      slide.backPath = '|list';
      slide.root = true;

      this.slideService.setItem('|list|' + slide.uuid, slide).subscribe(() => {
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
    this.submitted = true;

    if (event) {
      this.submitted = false;
    } else {
      this.submitted = false;
    }
  }
}
