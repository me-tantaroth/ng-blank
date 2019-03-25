import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

import {
  UserService,
  ServiceResponse as UserServiceResponse
} from '../../services/users.service';
import {
  AuthService,
  ServiceResponse as AuthServiceResponse
} from '../../../auth/services/auth.service';

import { ConfirmPasswordValidator } from '../../../shared/validators/confirm-password-validator';

import { User } from '../../models/user';
import { Message } from '../../../models/message';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @ViewChild('password') password: ElementRef;
  @Input() id: string;

  users: Observable<User[]>;
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
    store.select('users');
  }

  get f(): any {
    return this.form.controls;
  }

  ngOnInit() {
    this.users = this.usersService.list();

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
      deleted: new FormControl(false),
      emailVerified: new FormControl(false)
    });

    if (this.id) {
      this.usersService
        .get(this.id)
        .subscribe((userResponse: UserServiceResponse) => {
          console.log(userResponse);
          if (userResponse) {
            const user: User = userResponse.value;

            this.form.patchValue({
              displayName: user.displayName,
              email: user.email,
              username: user.username,
              password: this.password.nativeElement.value,
              confirmPassword: this.password.nativeElement.value,
              blocked: user.blocked,
              deleted: user.deleted,
              phoneNumber: user.phoneNumber,
              emailVerified: user.emailVerified,
              cite: user.cite,
              aboutMe: user.aboutMe
            });
          }
        })
        .unsubscribe();
    }
  }

  reset() {
    this.form.reset();
  }

  addConfirmPassword(passwordValue) {
    if (this.id) {
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

    if (this.id) {
      delete value.password;
      delete value.confirmPassword;

      this.usersService
        .set(this.id, new User(value))
        .subscribe((userResponse: UserServiceResponse) => {
          if (userResponse) {
            this.message = {
              show: true,
              label: 'Info',
              sublabel: 'User edited',
              color: 'accent',
              icon: 'info'
            };

            this.router.navigate(['/user/list']);
          }
        })
        .unsubscribe();
    } else {
      const password = value.confirmPassword;

      delete value.password;
      delete value.confirmPassword;

      this.authService
        .emailSignUp(value.email, password)
        .subscribe((authResponse: AuthServiceResponse) => {
          if (authResponse.status) {
            this.usersService
              .push(new User(value))
              .subscribe((userResponse: UserServiceResponse) => {
                if (userResponse) {
                  this.message = {
                    show: true,
                    label: 'Info',
                    sublabel: 'User created',
                    color: 'accent',
                    icon: 'info'
                  };

                  this.authService
                    .signOut()
                    .subscribe((signOutResponse: AuthServiceResponse) => {
                      if (signOutResponse.status) {
                        this.authService
                          .emailSignIn(value.email, password)
                          .subscribe((signInReponse: AuthServiceResponse) => {
                            if (signInReponse.status) {
                              this.router.navigate(['/auth/sign-in']);
                            }
                          })
                          .unsubscribe();
                      }
                    });
                }
              })
              .unsubscribe();
          } else {
            this.message = {
              show: true,
              label: 'Error!',
              sublabel: authResponse.error,
              color: 'warn',
              icon: 'error'
            };
          }
        })
        .unsubscribe();
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
