import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

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

  reset() {
    this.form.reset();
  }

  errors(controlField: string) {
    return Object.keys(this.f[controlField].errors);
  }

  onFilesChanged(files) {
    if (files && files.length && files.length > 0) {
      const file = files[0];

      console.log(file, file.type.search('image/'));
      if (file.type.search('image/') >= 0) {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        console.log('=??=?=?==?');
        reader.onload = (event: any) => {
          console.log(event, '>>>>>>>');
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
    console.log('## FORM FILE', event, this.form);

    const value = event[event.index];
    const file: File = new File(value);

    if (this.filter.search('edit') >= 0) {
      file.dbPath = this.value + '|enabled';
      file.currentPath = this.value + '|enabled|' + file.uid;
      file.backPath = this.value;
      file.root = true;

      this.fileService
        .setItem(this.value, file)
        .subscribe((status: boolean) => {
          if (status) {
            this.message = {
              show: true,
              label: 'Info',
              sublabel: 'Guardado',
              color: 'accent',
              icon: 'info'
            };

            this.router.navigate(['/admin/file/list']);
          }
        })
        .unsubscribe();
    } else if (this.filter.search('add') >= 0) {
      if (this.value) {
        file.dbPath = this.value + '|enabled';
        file.currentPath = this.value + '|enabled|' + file.uid;
        file.backPath = this.value;
        file.root = true;

        console.log('===>', this.value + '|enabled|' + file.uid, file);
        this.fileService
          .setItem(this.value + '|enabled|' + file.uid, file)
          .pipe(first())
          .subscribe((status: boolean) => {
            if (status) {
              this.message = {
                show: true,
                label: 'Info',
                sublabel: 'Guardado',
                color: 'accent',
                icon: 'info'
              };

              this.router.navigate(['/admin/file/list']);
            }
          });
      } else {
        file.dbPath = '|enabled';
        file.currentPath = '|enabled|' + file.uid;
        file.backPath = '';
        file.root = true;

        this.fileService
          .setItem('|enabled|' + file.uid, file)
          .subscribe((status: boolean) => {
            if (status) {
              this.message = {
                show: true,
                label: 'Info',
                sublabel: 'Guardado',
                color: 'accent',
                icon: 'info'
              };

              this.router.navigate(['/admin/file/list']);
            }
          })
          .unsubscribe();
      }
    } else {
      file.dbPath = '|enabled';
      file.currentPath = '|enabled|' + file.uid;
      file.backPath = '';
      file.root = true;

      this.fileService
        .setItem('|enabled|' + file.uid, file)
        .subscribe((status: boolean) => {
          if (status) {
            this.message = {
              show: true,
              label: 'Info',
              sublabel: 'Archivo guardado',
              color: 'accent',
              icon: 'info'
            };

            this.router.navigate(['/admin/file/list']);
          }
        })
        .unsubscribe();
    }

    this.reset();

    // if (this.action.search('add') >= 0) {
    //   if (this.path && this.file) {
    //     value.path = this.path + '|file|' + this.file.file.length;
    //     value.backPath = this.path;

    //     this.fileService
    //       .pushWithPath(this.path, value)
    //       .subscribe((fileResponse: FileServiceResponse) => {
    //         if (fileResponse) {
    //           this.message = {
    //             show: true,
    //             label: 'Info',
    //             sublabel: 'File creado',
    //             color: 'accent',
    //             icon: 'info'
    //           };
    //         }

    //         this.router.navigate(['/admin/file/list/path', this.path]);
    //       })
    //       .unsubscribe();
    //   } else {
    //     this.fileService
    //       .list()
    //       .subscribe((fileList: File[]) => {
    //         if (!!fileList) {
    //           value.root = true;
    //           value.path = '|' + fileList.length;

    //           this.fileService
    //             .push(value)
    //             .subscribe((fileResponse: FileServiceResponse) => {
    //               if (fileResponse) {
    //                 this.message = {
    //                   show: true,
    //                   label: 'Info',
    //                   sublabel: 'file creado',
    //                   color: 'accent',
    //                   icon: 'info'
    //                 };
    //               }

    //               this.router.navigate(['/admin/file/list']);
    //             })
    //             .unsubscribe();
    //         }
    //       })
    //       .unsubscribe();
    //   }
    // } else if (this.action.search('edit') >= 0) {
    //   if (this.path && this.file) {
    //     this.file.name = value.name;
    //     this.file.type = value.type;
    //     this.file.size = value.size;
    //     this.file.link = value.link;
    //     this.file.lastModifiedDate = value.lastModifiedDate;
    //     this.file.blocked = value.blocked;
    //     this.file.deleted = value.deleted;

    //     this.fileService
    //       .setWithPath(this.path, this.file)
    //       .subscribe((fileResponse: FileServiceResponse) => {
    //         if (fileResponse) {
    //           this.message = {
    //             show: true,
    //             label: 'Info',
    //             sublabel: 'file editado',
    //             color: 'accent',
    //             icon: 'info'
    //           };
    //         }

    //         if (this.file.root) {
    //           this.router.navigate(['/admin/file/list']);
    //         } else {
    //           this.router.navigate([
    //             '/admin/file/list/path',
    //             this.file.backPath
    //           ]);
    //         }
    //       })
    //       .unsubscribe();
    //   }
    // }
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
