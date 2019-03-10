import { Component, OnInit } from '@angular/core';
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
      ])
    });
  }

  reset() {
    this.form.reset();
  }

  onSubmitting(event: any) {
    const value = event[event.index];

    this.auth.emailSignUp(value.email, value.password).subscribe((response) => {
      if (response.status) {
        delete value.password;
        delete value.confirmPassword;

        this.users.push(value);
        this.auth.signOut().subscribe(
          responseSignOut => {
            if (responseSignOut.status) {
              this.router.navigate(['/auth/sign-in']);
            }
          }
        );
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
  onSubmitted(event: boolean) {
    this.submitted = true;

    if (event) {
      this.submitted = false;
      this.reset();
    }
  }
}
