import { Observable } from 'rxjs';

export class FormGroup<T = { [key: string]: string }> {
  name?: string;
  valueChanges: Observable<T>;
  value: T;
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
