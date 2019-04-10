import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { Accents } from '../../../../shared/utils';

import { UserService } from '../../services/users.service';
import {
  AuthService,
  ServiceResponse as AuthServiceResponse
} from '../../../../core/auth/services/auth.service';

import { ConfirmPasswordValidator } from '../../../../shared/validators/confirm-password-validator';

import { User, Users } from '../../models/user';
import { Message } from '../../../../models/message';

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

  users: Observable<Users>;
  submitted: boolean;
  form: FormGroup;
  editing: boolean;
  message: Message = {
    show: false
  };

  constructor(
    private store: StoreService,
    private usersService: UserService,
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
    console.log(event)
    this.message = {
      show: false
    };

    const value = event[event.index];
    const user: User = new User(value);

    console.log('## FILTER', this.filter, user)

    if (this.filter === 'edit') {
      user.dbPath = '|enabled';
      user.currentPath = '|enabled|' + user.uid;
      user.backPath = this.value;
      user.root = true;

      this.usersService
        .setItem(this.value, user)
        .subscribe((status: boolean) => {
          if (status) {
            this.message = {
              show: true,
              label: 'Info',
              sublabel: 'Página guardado',
              color: 'accent',
              icon: 'info'
            };

            this.router.navigate(['/admin/user/list']);
          }
        })
        .unsubscribe();
    } else if (this.filter === 'add') {
      if (this.value) {
        user.dbPath = this.value + '|enabled';
        user.currentPath = this.value + '|enabled|' + user.uid;
        user.backPath = this.value;
        user.root = true;

        this.usersService
          .setItem(this.value + '|enabled|' + user.uid, user)
          .subscribe((status: boolean) => {
            if (status) {
              this.message = {
                show: true,
                label: 'Info',
                sublabel: 'Página guardado',
                color: 'accent',
                icon: 'info'
              };

              this.router.navigate(['/admin/user/list']);
            }
          })
          .unsubscribe();
      } else {
        user.dbPath = '|enabled';
        user.currentPath = '|enabled|' + user.uid;
        user.backPath = '';
        user.root = true;

        this.usersService
          .setItem('|enabled|' + user.uid, user)
          .subscribe((status: boolean) => {
            if (status) {
              this.message = {
                show: true,
                label: 'Info',
                sublabel: 'Página guardado',
                color: 'accent',
                icon: 'info'
              };

              this.router.navigate(['/admin/user/list']);
            }
          })
          .unsubscribe();
      }
    } else {
      user.dbPath = '|enabled';
      user.currentPath = '|enabled|' + user.uid;
      user.backPath = '';
      user.root = true;

      this.usersService
        .setItem('|enabled|' + user.uid, user)
        .subscribe((status: boolean) => {
          if (status) {
            this.message = {
              show: true,
              label: 'Info',
              sublabel: 'Página guardado',
              color: 'accent',
              icon: 'info'
            };

            this.router.navigate(['/admin/user/list']);
          }
        })
        .unsubscribe();
    }

    this.reset();
  }
  onSubmitted(event: boolean) {
    this.submitted = true;
    console.log(event);

    if (event) {
      this.submitted = false;
      this.reset();
    } else {
      this.submitted = false;
    }
  }
}
