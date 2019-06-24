import { Observable } from 'rxjs';
import { FormInputOptions } from './form.tokens';

export class FormGroup<T = FormInputOptions> {
  name?: string;
  valueChanges: Observable<T>;
  value: T;
  valid: boolean;
  invalid: boolean;
  errors: T = {} as any;
  constructor(value: T) {
    this.value = value;
  }
  getValue(name: keyof T): keyof T {
    return;
  }
  setValue(name: keyof T, payload: any): T[keyof T] {
    return;
  }
}
