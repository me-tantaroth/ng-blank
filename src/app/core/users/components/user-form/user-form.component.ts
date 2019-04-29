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

import { ConfirmPasswordValidator } from '../../../../shared/validators/confirm-password-validator';
import { Accents } from '../../../../shared/utils';

import {
  StorageService,
  FileUploaded
} from '../../../services/storage.service';
import { ModulesService } from '../../../modules/services/modules.service';
import { UsersService } from '../../../users/services/users.service';
import {
  AuthService,
  ServiceResponse as AuthServiceResponse
} from '../../../auth/services/auth.service';

import { Message } from '../../../../models/message';
import { Module } from 'src/app/core/modules/models/module';
import { User } from 'src/app/core/users/models/user';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() user: User;
  @Input() filter: string;
  @Input() value: string;

  uuid: string;
  ref: string;
  fileUploaded: Observable<FileUploaded>;
  users: Observable<User[]>;
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
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router
  ) {
    this.store.select('users');
  }

  get f(): any {
    return this.form.controls;
  }

  ngOnInit() {
    this.uuid = this.afs.createId();

    this.form = new FormGroup({
      uid: new FormControl(),
      index: new FormControl(),
      displayName: new FormControl(''),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern(
          /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        )
      ]),
      username: new FormControl(''),
      phoneNumber: new FormControl(''),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,45}/),
        Validators.minLength(8),
        Validators.maxLength(45)
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,45}/),
        Validators.minLength(8),
        Validators.maxLength(45),
        ConfirmPasswordValidator('password')
      ]),
      cite: new FormControl(''),
      aboutMe: new FormControl(''),
      emailVerified: new FormControl(false),
      principalPath: new FormControl(''),
      currentPath: new FormControl(''),
      dbPath: new FormControl(''),
      postedAt: new FormControl(),
      externalURL: new FormControl(false),
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

  onPathChanged(event) {
    const username = new Accents()
      .removeDiacritics(event.target.value)
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[-\/\\^$*+?.()|[\]{}]/g, '');

    this.form.patchValue({
      principalPath: username,
      username
    });
  }

  addConfirmPassword(passwordValue) {
    if (this.value) {
      this.form.patchValue({
        confirmPassword: passwordValue
      });
    }
  }

  onSubmitting(event: any) {
    this.message = {
      show: false
    };

    const value = event[event.index];
    const password = value.password;
    const user: User = new User(value);
    const userModule$: Observable<Module> = this.modulesService.getItem(
      '|user'
    );
    const currentUser$: Observable<User> = this.usersService.getItem(
      this.store.get('currentUserPermissions').path
    );

    this.ref = '|list|' + this.uuid;

    if (this.filter.search('edit') >= 0) {
      this.ref = this.value;
      user.customPath = this.value + '|list';
    } else if (this.filter.search('add') >= 0) {
      user.absolutePath =
        '/projects/blank-fire/langs/es/modules/drive/list/' + user.uuid;

      if (this.value) {
        this.ref = this.value + '|list|' + user.uuid;

        user.uuid = this.uuid;
        user.customPath = this.value + '|list|' + user.uuid + '|list';
        user.backPath = this.value + '|list';
        user.root = true;
        user.absolutePath = `/projects/blank-fire/langs/es/modules/drive${this.value
          .split('|')
          .join('/')}/list/${user.uuid}`;
      } else {
        user.uuid = this.uuid;
        user.customPath = '|list|' + user.uuid + '|list';
        user.backPath = '|list';
        user.root = true;

        this.ref = '|list|' + user.uuid;
      }
    } else {
      user.uuid = this.uuid;
      user.customPath = '|list|' + user.uuid + '|list';
      user.backPath = '|list';
      user.root = true;

      this.ref = '|list|' + user.uuid;
    }

    combineLatest([userModule$, currentUser$])
      .pipe(first())
      .subscribe(([userModule, currentUser]) => {
        userModule.count = userModule.count || 0;

        if (
          (currentUser.permissions.user_write &&
            !currentUser.permissions.user_write_limit) ||
          (currentUser.permissions.user_write &&
            currentUser.permissions.user_write_limit &&
            currentUser.permissions.user_write_limit_max &&
            userModule.count < currentUser.permissions.user_write_limit_max) ||
          ((this.filter.search('add') >= 0 &&
            currentUser.permissions.user_create &&
            !currentUser.permissions.user_create_limit) ||
            (currentUser.permissions.user_create &&
              currentUser.permissions.user_create_limit &&
              currentUser.permissions.user_create_limit_max &&
              userModule.count <
                currentUser.permissions.user_create_limit_max)) ||
          ((this.filter.search('edit') >= 0 &&
            currentUser.permissions.user_update &&
            !currentUser.permissions.user_update_limit) ||
            (currentUser.permissions.user_update &&
              currentUser.permissions.user_update_limit &&
              currentUser.permissions.user_update_limit_max &&
              userModule.count < currentUser.permissions.user_update_limit_max))
        ) {
          this.authService
            .emailSignUp(user.email, password)
            .pipe(first())
            .subscribe((authServiceResponse: AuthServiceResponse) => {
              if (authServiceResponse.status) {
                this.usersService.setItem(this.ref, user).subscribe(() => {
                  if (this.filter.search('add') >= 0) {
                    userModule.count = (userModule.count || 0) + 1;
                  }

                  this.modulesService
                    .setItem('|user', userModule)
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
                  sublabel: authServiceResponse.error.message,
                  color: 'warn',
                  icon: 'error'
                };
              }
            });
        } else {
          this.message = {
            show: true,
            label: 'Error!',
            sublabel:
              'No tiene los permisos suficientes para hacer esta acción!',
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
