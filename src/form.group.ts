import { Observable, BehaviorSubject } from 'rxjs';
import { FormInputOptions } from './form.tokens';
import { LitElement } from '@rxdi/lit-html';

export class FormGroup<T = FormInputOptions> {
  public validators: Map<string, Function[]> = new Map();
  public valid: boolean;
  public invalid: boolean;
  public errors: T = {} as any;

  private readonly _valueChanges: BehaviorSubject<T> = new BehaviorSubject(
    {} as any
  );
  private form: HTMLFormElement;
  private errorMap = new WeakMap();
  private inputs: Map<any, HTMLInputElement> = new Map();

  constructor(value?: T) {
    this.value = value;
  }

  get valueChanges() {
    return this._valueChanges.asObservable();
  }

  public validate(element: LitElement, input: HTMLInputElement) {
    const validators = this.validators.get(input.name);
    let errors = [];
    if (validators && validators.length) {
      errors = validators
        .map(v => {
          this.errors[input.name] = this.errors[input.name] || {};
          const error = v.bind(element)(input);
          if (error && error.key) {
            this.errors[input.name][error.key] = error.message;
            this.errorMap.set(v, error.key);
            return this.errors[input.name];
          } else if (this.errorMap.has(v)) {
            delete this.errors[input.name][this.errorMap.get(v)];
          }
        })
        .filter(i => !!i);
    }
    return errors;
  }

  public get(name: keyof T) {
    return this.inputs.get(name);
  }

  public getError(inputName: string, errorKey: string) {
    return this.errors[inputName][errorKey];
  }

  public hasError(inputName: string, errorKey: string) {
    return !!this.getError(inputName, errorKey);
  }

  public reset() {
    this.form.reset();
    this.errors = {} as any;
    this.valid = true;
    this.invalid = false;
  }

  public get value() {
    return this._valueChanges.getValue();
  }

  public set value(value: T) {
    this._valueChanges.next(value);
  }

  public unsubscribe() {
    this._valueChanges.unsubscribe();
  }
  public subscribe() {
    this._valueChanges.subscribe();
  }

  public getValue(name: keyof T): T[keyof T] {
    return this.value[name];
  }

  public setValue(name: string, value: any) {
    const values = this.value;
    values[name] = value;
    this.value = values;
    return values;
  }

  public setFormValue(value: T) {
    this.value = value;
  }

  public setFormElement(form: HTMLFormElement) {
    this.form = form;
  }

  public setFormInputs(inputs: HTMLInputElement[]) {
    this.inputs = new Map(inputs.map(e => [e.name, e]));
  }

  public getFormElement() {
    return this.form;
  }
}
