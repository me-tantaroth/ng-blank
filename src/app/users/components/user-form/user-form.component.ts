import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StoreService } from 'ng-barn';

import { ConfirmPasswordValidator } from '../../../shared/validators/confirm-password-validator';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  submitted: boolean;
  form: FormGroup;
  editing: boolean;

  constructor(private store: StoreService) {
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

    delete value.password;
    delete value.confirmPassword;

    this.store.update(event.index, value);
  }
  onSubmitted(event: boolean) {
    this.submitted = true;

    if (event) {
      this.submitted = false;
      this.reset();
    }
  }
}
