import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';
import * as _moment from 'moment';
import { Observable } from 'rxjs';

import { FileService } from '../../services/file.service';

import { File } from '../../models/file';
import { Message } from '../../../../models/message';

@Component({
  selector: 'app-file-form',
  templateUrl: './file-form.component.html',
  styleUrls: ['./file-form.component.scss']
})
export class FileFormComponent implements OnInit, OnChanges {
  @Input() file: File;
  @Input() filter: string;
  @Input() value: string;

  events: string[] = [];
  files: Observable<File[]>;
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
    private fileService: FileService,
    private router: Router
  ) {
    store.select('files');
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
      text: new FormControl('', Validators.required),
      uuid: new FormControl(''),
      customPath: new FormControl(''),
      backPath: new FormControl(''),
      absolutePath: new FormControl(''),
      type: new FormControl(),
      size: new FormControl(''),
      lastModifiedDate: new FormControl(''),
      url: new FormControl(''),
      previewImage: new FormControl(''),
      externalURL: new FormControl(false),
      root: new FormControl(true),
      blocked: new FormControl(true),
      deleted: new FormControl(false)
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.file.currentValue) {
      if (this.filter.search('edit') >= 0) {
        this.form.patchValue(changes.file.currentValue);
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
    if (files && files.length && files.length > 0) {
      const file = files[0];

      if (file.type.search('image/') >= 0) {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = (event: any) => {
          // UPLOAD FILE TO FIRESTORAGE
          // GET DOWNLOAD URL AND ADD THIS URL TO FORM LINK
          this.form.patchValue({
            text: file.text,
            type: file.type,
            size: file.size,
            lastModifiedDate: file.lastModifiedDate,
            url: event.target.result,
            previewImage: 'http://www.clker.com/cliparts/V/k/G/v/Z/3/new-file-simple-md.png'
          });
        };
      } else {
        // UPLOAD FILE TO FIRESTORAGE
        // GET DOWNLOAD URL AND ADD THIS URL TO FORM LINK
        this.form.patchValue({
          text: file.text,
          type: file.type,
          size: file.size,
          lastModifiedDate: file.lastModifiedDate
        });
      }
    }
  }

  onSubmitting(event: any) {
    this.message = {
      show: false
    };

    const value = event[event.index];
    const file: File = new File(value);

    file.name = file.text;

    if (this.filter.search('edit') >= 0) {
      file.customPath = this.value + '|list';

      this.fileService.setItem(this.value, file).subscribe(() => {
        this.message = {
          show: true,
          label: 'Info',
          sublabel: 'Guardado',
          color: 'accent',
          icon: 'info'
        };
      });
    } else if (this.filter.search('add') >= 0) {
      file.absolutePath =
        '/projects/blank-fire/langs/es/modules/drive/list/' + file.uuid;

      if (this.value) {
        file.uuid = this.afs.createId();
        file.customPath = this.value + '|list|' + file.uuid + '|list';
        file.backPath = this.value + '|list';
        file.root = true;
        file.absolutePath = `/projects/blank-fire/langs/es/modules/drive${this.value
          .split('|')
          .join('/')}/list/${file.uuid}`;

        this.fileService
          .setItem(this.value + '|list|' + file.uuid, file)
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
        file.uuid = this.afs.createId();
        file.customPath = '|list|' + file.uuid + '|list';
        file.backPath = '|list';
        file.root = true;

        this.fileService.setItem('|list|' + file.uuid, file).subscribe(() => {
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
      file.uuid = this.afs.createId();
      file.customPath = '|list|' + file.uuid + '|list';
      file.backPath = '|list';
      file.root = true;

      this.fileService.setItem('|list|' + file.uuid, file).subscribe(() => {
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
      this.reset();
    } else {
      this.submitted = false;
    }
  }
}
