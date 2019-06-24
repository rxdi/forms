import { BehaviorSubject } from 'rxjs';
import { FormInputOptions, FormOptions } from './form.tokens';
import { LitElement } from '@rxdi/lit-html';

export class FormGroup<T = FormInputOptions, E = {[key: string]: any;}> {
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

  constructor(value?: T, errors?: keyof E) {
    this.value = value;
  }

  get valueChanges() {
    return this._valueChanges.asObservable();
  }

  public updateValueAndValidity(
    method: Function,
    parentElement: LitElement,
    multi: boolean = true
  ) {
    const self = this;
    return function(
      this: HTMLInputElement,
      event: { target: HTMLInputElement }
    ) {
      let value = this.value;
      const hasMultipleBindings = [
        ...(self
          .getFormElement()
          .querySelectorAll(`input[name="${this.name}"]`) as any).values()
      ].length;
      if (
        hasMultipleBindings === 1 &&
        (this.type === 'checkbox' || this.type === 'radio')
      ) {
        value = String(this.checked);
      }

      if (multi && hasMultipleBindings > 1) {
        [
          ...(self
            .getFormElement()
            .querySelectorAll('input:checked') as any).values()
        ].forEach(el => (el.checked = false));
        this.checked = true;
      }
      const form = self.getFormElement();
      const errors = self.validate(parentElement, this);
      if (errors.length) {
        form.invalid = true;
      } else {
        self.errors[this.name] = {} as any;
        form.invalid = false;
        self.setValue(this.name, value);
      }
      parentElement.requestUpdate();
      return method.call(parentElement, event);
    };
  }

  public querySelectForm(
    shadowRoot: HTMLElement,
    options: FormOptions
  ): HTMLFormElement {
    const form = shadowRoot.querySelector(
      `form[name="${options.name}"]`
    ) as HTMLFormElement;
    if (!form) {
      throw new Error(`Form element not present inside ${this}`);
    }
    return form;
  }

  public querySelectorAllInputs(self: LitElement, options: FormOptions) {
    return [
      ...((this.form.querySelectorAll('input') as any) as Map<
        string,
        HTMLInputElement
      >).values()
    ]
      .filter(el => this.isInputPresentOnStage(el))
      .filter(el => !!el.name)
      .map((el: HTMLInputElement) => {
        el.ondragleave;
        el[`on${options.strategy}`] = this.updateValueAndValidity(
          el[`on${options.strategy}`] || function() {},
          self,
          options.multi
        );
        return el;
      });
  }

  public isInputPresentOnStage(input: HTMLInputElement) {
    const isInputPresent = Object.keys(this.value).filter(
      v => v === input.name
    );
    if (!isInputPresent.length) {
      throw new Error(
        `Missing input element with name ${input.name} for form ${
          this.getFormElement().name
        }`
      );
    }
    return isInputPresent.length;
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

  public getError(inputName: keyof T, errorKey: keyof E) {
    return this.errors[inputName][errorKey as any];
  }

  public hasError(inputName: keyof T, errorKey: keyof E) {
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
