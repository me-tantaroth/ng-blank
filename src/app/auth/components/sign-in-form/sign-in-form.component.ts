import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'ng-barn';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.scss']
})
export class SignInFormComponent implements OnInit {
  submitted: boolean;
  index: number;
  form: FormGroup;

  constructor(private router: Router, private store: StoreService, private auth: AuthService) {
    store.select('authentications');
  }

  get passwordField(): any {
    return this.form.controls && this.form.controls.password
      ? this.form.controls.password
      : null;
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

    this.auth.emailSignIn(value.email, value.password).subscribe((response) => {
      if (response.status) {
        console.log(response)
        this.store.set(value, 'authenticated');

        this.router.navigate(['/']);
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
