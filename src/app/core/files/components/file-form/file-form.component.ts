import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';
import * as _moment from 'moment';
import { Observable } from 'rxjs';

import {
  FileService,
  ServiceResponse as FileServiceResponse
} from '../../services/file.service';

import { File } from '../../models/file';
import { Message } from '../../../../models/message';

@Component({
  selector: 'app-file-form',
  templateUrl: './file-form.component.html',
  styleUrls: ['./file-form.component.scss']
})
export class FileFormComponent implements OnInit {
  @Input() file: File;
  @Input() action: string;
  @Input() path: string;

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
      name: new FormControl('', Validators.required),
      type: new FormControl(''),
      size: new FormControl(''),
      lastModifiedDate: new FormControl(''),
      link: new FormControl(''),
      blocked: new FormControl(true),
      deleted: new FormControl(false)
    });

    if (this.action.search('edit') >= 0) {
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

      console.log(file);
      if (file.type.search('image/') > 0) {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = (event: any) => {
          // UPLOAD FILE TO FIRESTORAGE
          // GET DOWNLOAD URL AND ADD THIS URL TO FORM LINK
          this.form.patchValue({
            name: file.name,
            type: file.type,
            size: file.size,
            lastModifiedDate: file.lastModifiedDate,
            link: event.target.result
          });
        };
      } else {
        // UPLOAD FILE TO FIRESTORAGE
        // GET DOWNLOAD URL AND ADD THIS URL TO FORM LINK
        this.form.patchValue({
          name: file.name,
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

    const value = new File(event[event.index]);

    if (this.action.search('add') >= 0) {
      if (this.path && this.file) {
        value.path = this.path + '|file|' + this.file.file.length;
        value.backPath = this.path;

        this.fileService
          .pushWithPath(this.path, value)
          .subscribe((fileResponse: FileServiceResponse) => {
            if (fileResponse) {
              this.message = {
                show: true,
                label: 'Info',
                sublabel: 'File creado',
                color: 'accent',
                icon: 'info'
              };
            }

            this.router.navigate(['/admin/file/list/path', this.path]);
          })
          .unsubscribe();
      } else {
        this.fileService
          .list()
          .subscribe((fileList: File[]) => {
            if (!!fileList) {
              value.root = true;
              value.path = '|' + fileList.length;

              this.fileService
                .push(value)
                .subscribe((fileResponse: FileServiceResponse) => {
                  if (fileResponse) {
                    this.message = {
                      show: true,
                      label: 'Info',
                      sublabel: 'file creado',
                      color: 'accent',
                      icon: 'info'
                    };
                  }

                  this.router.navigate(['/admin/file/list']);
                })
                .unsubscribe();
            }
          })
          .unsubscribe();
      }
    } else if (this.action.search('edit') >= 0) {
      if (this.path && this.file) {
        this.file.name = value.name;
        this.file.type = value.type;
        this.file.size = value.size;
        this.file.link = value.link;
        this.file.lastModifiedDate = value.lastModifiedDate;
        this.file.blocked = value.blocked;
        this.file.deleted = value.deleted;

        this.fileService
          .setWithPath(this.path, this.file)
          .subscribe((fileResponse: FileServiceResponse) => {
            if (fileResponse) {
              this.message = {
                show: true,
                label: 'Info',
                sublabel: 'file editado',
                color: 'accent',
                icon: 'info'
              };
            }

            if (this.file.root) {
              this.router.navigate(['/admin/file/list']);
            } else {
              this.router.navigate([
                '/admin/file/list/path',
                this.file.backPath
              ]);
            }
          })
          .unsubscribe();
      }
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
