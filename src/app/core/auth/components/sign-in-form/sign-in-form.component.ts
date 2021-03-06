import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StoreService } from 'ng-barn';

import { AuthService, ServiceResponse as AuthServiceResponse } from '../../services/auth.service';

import { Message } from '../../../../models/message';

@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.scss']
})
export class SignInFormComponent implements OnInit {
  submitted: boolean;
  index: number;
  form: FormGroup;
  message: Message = {
    show: false
  };

  constructor(
    private router: Router,
    private store: StoreService,
    private auth: AuthService
  ) {
    store.select('authentications');
  }

  get f(): any {
    return this.form.controls;
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ])
    });
  }

  reset() {
    this.form.reset();
  }

  onSubmitting(event: any) {
    const value = event[event.index];

    this.auth
      .emailSignIn(value.email, value.password)
      .pipe(first())
      .subscribe((suthServiceResponse: AuthServiceResponse) => {
        if (suthServiceResponse.status) {
          this.store.set(value, 'authenticated');

          this.message = {
            show: false
          };

          this.router.navigate(['/']);
        } else {
          this.message = {
            show: true,
            label: 'Error!',
            sublabel: suthServiceResponse.error.message,
            color: 'warn',
            icon: 'error'
          };

          if (suthServiceResponse.error.code === 'user-deleted') {
            this.router.navigate(['/auth/recovery']);
          }
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
