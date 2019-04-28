import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { Accents } from '../../../../shared/utils';

import { UserService } from '../../services/user.service';
import {
  AuthService,
  ServiceResponse as AuthServiceResponse
} from '../../../../core/auth/services/auth.service';

import { ConfirmPasswordValidator } from '../../../../shared/validators/confirm-password-validator';

import { User } from '../../models/user';
import { Message } from '../../../../models/message';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @ViewChild('password') password: ElementRef;
  @Input() user: User;
  @Input() filter: string;
  @Input() value: string;

  users: Observable<User[]>;
  submitted: boolean;
  form: FormGroup;
  editing: boolean;
  message: Message = {
    show: false
  };

  constructor(
    private afs: AngularFirestore,
    private store: StoreService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.store.select('users');
  }

  get f(): any {
    return this.form.controls;
  }

  ngOnInit() {
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

    if (this.filter === 'edit') {
      this.form.patchValue(this.user);
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

    delete value.password;
    delete value.confirmPassword;

    const user: User = new User(value);

    if (this.filter === 'edit') {
      user.dbPath = this.value;
      user.currentPath = this.value;
      user.backPath = this.value;
      user.root = true;

      this.userService
        .setItem(this.value, user)
        .pipe(first())
        .subscribe((status: any) => {
          if (status) {
            this.message = {
              show: true,
              label: 'Info',
              sublabel: 'Usuario editado',
              color: 'accent',
              icon: 'info'
            };

            // this.router.navigate(['/admin/user/list']);
          }
        });
    } else if (this.filter === 'add') {
      user.uid = this.afs.createId();

      if (this.value) {
        user.dbPath = this.value + '|enabled|list';
        user.currentPath = this.value + '|enabled|list|' + user.uid;
        user.backPath = this.value;
        user.root = true;

        this.authService
          .emailSignUp(user.email, password)
          .pipe(first())
          .subscribe((authServiceResponse: AuthServiceResponse) => {
            if (authServiceResponse.status) {
              this.userService
                .setItem(user.currentPath, user)
                .pipe(first())
                .subscribe((status: any) => {
                  if (status) {
                    this.message = {
                      show: true,
                      label: 'Info',
                      sublabel: 'Usuario guardado',
                      color: 'accent',
                      icon: 'info'
                    };

                    // this.router.navigate(['/admin/user/list']);
                  }
                });

              this.message = {
                show: true,
                label: 'Info',
                sublabel: 'Usuario creado',
                color: 'accent',
                icon: 'info'
              };

              // this.router.navigate(['/admin/user/list']);
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
        user.dbPath = '|enabled|list';
        user.currentPath = '|enabled|list|' + user.uid;
        user.backPath = '';
        user.root = true;

        this.authService
          .emailSignUp(user.email, password)
          .pipe(first())
          .subscribe((authServiceResponse: AuthServiceResponse) => {
            if (authServiceResponse.status) {
              this.userService
                .setItem(user.currentPath, user)
                .pipe(first())
                .subscribe((status: any) => {
                  if (status) {
                    this.message = {
                      show: true,
                      label: 'Info',
                      sublabel: 'Usuario guardado',
                      color: 'accent',
                      icon: 'info'
                    };

                    // this.router.navigate(['/admin/user/list']);
                  }
                });

              this.message = {
                show: true,
                label: 'Info',
                sublabel: 'Usuario creado',
                color: 'accent',
                icon: 'info'
              };

              // this.router.navigate(['/admin/user/list']);
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
      }
    } else {
      user.uid = this.afs.createId();
      user.dbPath = '|enabled|list';
      user.currentPath = '|enabled|list|' + user.uid;
      user.backPath = '';
      user.root = true;

      this.authService
        .emailSignUp(user.email, password)
        .pipe(first())
        .subscribe((authServiceResponse: AuthServiceResponse) => {
          if (authServiceResponse.status) {
            this.userService
              .setItem(user.currentPath, user)
              .pipe(first())
              .subscribe((status: any) => {
                if (status) {
                  this.message = {
                    show: true,
                    label: 'Info',
                    sublabel: 'Usuario guardado',
                    color: 'accent',
                    icon: 'info'
                  };

                  // this.router.navigate(['/admin/user/list']);
                }
              });

            this.message = {
              show: true,
              label: 'Info',
              sublabel: 'Usuario creado',
              color: 'accent',
              icon: 'info'
            };

            // this.router.navigate(['/admin/user/list']);
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
