import { BehaviorSubject } from 'rxjs';
import { FormInputOptions } from './form.tokens';
import { LitElement } from '@rxdi/lit-html';

export class FormController<T = FormInputOptions> {
  private readonly _valueChanges: BehaviorSubject<T> = new BehaviorSubject(
    {} as any
  );
  validators: Map<string, Function[]> = new Map();
  valid: boolean;
  invalid: boolean;
  errors: T[] = {} as any;
  private form: HTMLFormElement;

  get valueChanges() {
    return this._valueChanges.asObservable();
  }

  validate(element: LitElement, input: HTMLInputElement) {
    const validators = this.validators.get(input.name);
    let errors = [];
    if (validators && validators.length) {
      errors = validators
        .map(v => {
          this.errors[input.name] = this.errors[input.name] || {};
          const error = v.bind(element)(input);
          if (error && error.key) {
            this.errors[input.name][error.key] = error.message;
            return this.errors[input.name];
          }
        })
        .filter(i => !!i);
    }
    return errors;
  }

  reset() {
    this.form.reset();
    this.errors = {} as any;
    this.valid = true;
    this.invalid = false;
  }

  get value() {
    return this._valueChanges.getValue();
  }

  set value(value: T) {
    this._valueChanges.next(value);
  }

  unsubscribe() {
    this._valueChanges.unsubscribe();
  }

  getValue(name: keyof T): T[keyof T] {
    return this.value[name];
  }

  setValue(name: string, value: any) {
    const values = this.value;
    values[name] = value;
    this.value = values;
    return values;
  }

  setFormValue(value: T) {
    this.value = value;
  }

  setFormElement(form: HTMLFormElement) {
    this.form = form;
  }

  getFormElement() {
    return this.form;
  }
}
