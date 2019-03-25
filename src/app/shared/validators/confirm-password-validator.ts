import { FormControl } from '@angular/forms';

export function ConfirmPasswordValidator(passwordControlName: string) {
  let confirmPasswordControl: FormControl;
  let passwordControl: FormControl;

  return function matchOtherValidate(control: FormControl) {
    if (!control.parent) {
      return null;
    }

    // Initializing the validator.
    if (!confirmPasswordControl) {
      confirmPasswordControl = control;
      passwordControl = control.parent.get(passwordControlName) as FormControl;
      if (!passwordControl) {
        throw new Error(
          'matchOtherValidator(): other control is not found in parent group'
        );
      }
      passwordControl.valueChanges
        .subscribe(() => {
          confirmPasswordControl.updateValueAndValidity();
        })
        .unsubscribe();
    }

    if (!passwordControl) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      return {
        notMatched: true
      };
    }

    return null;
  };
}
