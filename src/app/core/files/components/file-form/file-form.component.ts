import { Component, OnInit, Input } from '@angular/core';
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
export class FileFormComponent implements OnInit {
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
      title: new FormControl('', Validators.required),
      uid: new FormControl(''),
      currentPath: new FormControl(''),
      backPath: new FormControl(''),
      dbPath: new FormControl(''),
      type: new FormControl(),
      size: new FormControl(''),
      lastModifiedDate: new FormControl(''),
      enabled: new FormControl(''),
      url: new FormControl(''),
      externalURL: new FormControl(false),
      root: new FormControl(true),
      blocked: new FormControl(true),
      deleted: new FormControl(false)
    });

    if (this.filter.search('edit') >= 0) {
      this.form.patchValue(this.file);
    }
  }

  prueba(file) {
    console.log('##', file);
    this.afs
      .doc(
        '/project/ng-fire-blank/lang/es/file/list/enabled/i58UWYELptXWQaeRciO0/list/enabled/asdasdasdsad'
      )
      .set(file, { merge: true });
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
            title: file.title,
            type: file.type,
            size: file.size,
            lastModifiedDate: file.lastModifiedDate,
            url: event.target.result
          });
        };
      } else {
        // UPLOAD FILE TO FIRESTORAGE
        // GET DOWNLOAD URL AND ADD THIS URL TO FORM LINK
        this.form.patchValue({
          title: file.title,
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

    console.log('### FILTER', this.filter);
    if (this.filter.search('edit') >= 0) {
      file.dbPath = this.value;
      file.currentPath = this.value;
      file.backPath = this.value;
      file.root = true;

      // this.fileService
      //   .setItem(this.value, file)
      //   .subscribe((response: FileServiceResponse) => {
      //     if (response.status) {
      //       this.message = {
      //         show: true,
      //         label: 'Info',
      //         sublabel: 'Guardado',
      //         color: 'accent',
      //         icon: 'info'
      //       };

      //       this.router.navigate(['/admin/file/list']);
      //     }
      //   });
    } else if (this.filter.search('add') >= 0) {
      console.log('### ADD FOLDER', this.value);
      if (this.value) {
        file.uid = this.afs.createId();
        file.dbPath = this.value + '|list|enabled';
        file.currentPath = this.value + '|list|enabled|' + file.uid;
        file.backPath = this.value;
        file.root = true;

        this.fileService
          .setItem(this.value + '|list|enabled|' + file.uid, file)
          .subscribe((response: boolean) => {
            if (response) {
              this.message = {
                show: true,
                label: 'Info',
                sublabel: 'Guardado',
                color: 'accent',
                icon: 'info'
              };

              this.afs
                .doc(file.currentPath.split('|').join('/'))
                .set({ name: 'Habilitado' });
            }
          });
      } else {
        file.uid = this.afs.createId();
        file.dbPath = '|list|enabled';
        file.currentPath = '|list|enabled|' + file.uid;
        file.backPath = '|list|enabled';
        file.root = true;

        this.fileService
          .setItem('|list|enabled|' + file.uid, file)
          .subscribe((status: boolean) => {
            if (status) {
              this.message = {
                show: true,
                label: 'Info',
                sublabel: 'Guardado',
                color: 'accent',
                icon: 'info'
              };
            }
          });
      }
    } else {
      file.uid = this.afs.createId();
      file.dbPath = '|list|enabled';
      file.currentPath = '|list|enabled|' + file.uid;
      file.backPath = '|list|enabled';
      file.root = true;

      this.fileService
        .setItem('|list|enabled|' + file.uid, file)
        .subscribe((status: boolean) => {
          if (status) {
            this.message = {
              show: true,
              label: 'Info',
              sublabel: 'Archivo guardado',
              color: 'accent',
              icon: 'info'
            };

            this.afs
              .doc(file.currentPath.split('|').join('/'))
              .set({ name: 'Habilitado' });
          }
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
