import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StoreService } from 'ng-barn';

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
      displayName: new FormControl('')
    });
  }

  reset() {
    this.form.reset();
  }

  onSubmitting(event: any) {
    const value = event[event.index];

    console.log(value, this.store);
  }
  onSubmitted(event: boolean) {
    this.submitted = true;

    console.log(this.form, this.store, event);
    if (event) {
      this.submitted = false;
      this.reset();
    }
  }
}
