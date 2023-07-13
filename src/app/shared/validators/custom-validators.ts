import { AbstractControl } from '@angular/forms';

export function minDateValidator(minDate: Date) {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value && control.value < minDate) {
      return { minDate: { value: control.value } };
    }
    return null;
  };
}

export function maxDateValidator(maxDate: Date) {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value && control.value > maxDate) {
      return { maxDate: { value: control.value } };
    }
    return null;
  };
}

export function minNumberValidator(minNum: number) {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control?.value || control.value < minNum) {
      return {
        inValidNumber: { message: `Minimum value of ${minNum} required` },
      };
    }
    return null;
  };
}

export function numericValidator() {
  return (control: AbstractControl): { [key: string]: any } | null => {

    if (!control?.value){
      return null;
    }

    if (isNaN(control?.value)) {
      return {
        inValidNumber: { message: `Only numeric values allowed` },
      };
    }
    return null;
  };
}
