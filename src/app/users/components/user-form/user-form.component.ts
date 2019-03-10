import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';

import { UsersService } from '../../services/users.service';
import { AuthService } from '../../../auth/services/auth.service';

import { ConfirmPasswordValidator } from '../../../shared/validators/confirm-password-validator';

import { User } from '../../models/user';
import { Message } from '../../../models/message';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @ViewChild('password')
  password: ElementRef;
  @Input() userId: string;

  users: User[] = [];
  submitted: boolean;
  form: FormGroup;
  editing: boolean;
  message: Message = {
    show: false
  };

  constructor(
    private store: StoreService,
    private usersService: UsersService,
    private auth: AuthService,
    private router: Router
  ) {
    this.users = usersService.users;
    store.select('users');
  }

  get f(): any {
    return this.form.controls;
  }

  ngOnInit() {
    this.form = new FormGroup({
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
      blocked: new FormControl(false),
      emailVerified: new FormControl(false)
    });

    if (this.userId && this.users[this.userId]) {
      const user = this.users[this.userId];

      this.form.patchValue({
        displayName: user.displayName,
        email: user.email,
        username: user.username,
        password: this.password.nativeElement.value,
        confirmPassword: this.password.nativeElement.value,
        blocked: user.blocked,
        phoneNumber: user.phoneNumber,
        emailVerified: user.emailVerified,
        cite: user.cite,
        aboutMe: user.aboutMe
      });
    }
  }

  reset() {
    this.form.reset();
  }

  addConfirmPassword(passwordValue) {
    if (this.userId) {
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

    if (this.userId) {
      delete value.password;
      delete value.confirmPassword;

      this.users[this.userId] = value;

      this.message = {
        show: true,
        label: 'Info',
        sublabel: 'User edited',
        color: 'accent',
        icon: 'info'
      };

      this.router.navigate(['/user/list']);
    } else {
      value.createdAt = new Date();

      this.auth
        .emailSignUp(value.email, value.password)
        .subscribe((response) => {
          if (response.status) {
            delete value.password;
            delete value.confirmPassword;

            this.users.push(value);

            this.message = {
              show: true,
              label: 'Info',
              sublabel: 'User created',
              color: 'accent',
              icon: 'info'
            };

            this.auth.signOut().subscribe((responseSignOut) => {
              if (responseSignOut.status) {
                this.router.navigate(['/auth/sign-in']);
              }
            });
          } else {
            this.message = {
              show: true,
              label: 'Error!',
              sublabel: response.error,
              color: 'warn',
              icon: 'error'
            };
          }
        });
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
