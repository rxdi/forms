import { FormInputOptions, FormOptions } from './form.tokens';
import { LitElement } from '@rxdi/lit-html';
import { BehaviorSubject } from './rx-fake';

export class FormGroup<T = FormInputOptions, E = { [key: string]: never }> {
  public validators: Map<string, Function[]> = new Map();
  public valid: boolean = true;
  public invalid: boolean = false;
  public errors: T = {} as T;

  private readonly _valueChanges: BehaviorSubject<T>;
  private form: HTMLFormElement;
  private errorMap = new WeakMap();
  private inputs: Map<keyof T, HTMLInputElement> = new Map();
  private options: FormOptions = {} as FormOptions;
  private parentElement: LitElement;

  constructor(value?: T, errors?: E) {
    this._valueChanges = new BehaviorSubject<T>(value);
  }

  setParentElement(parent: LitElement) {
    this.parentElement = parent;
  }

  getParentElement() {
    return this.parentElement;
  }

  setOptions(options: FormOptions) {
    Object.assign(this.options, options);
  }

  getOptions() {
    return this.options;
  }

  get valueChanges() {
    return this._valueChanges;
  }

  updateValueAndValidity() {
    this.resetErrors();
    const inputs = this.querySelectorAllInputs()
      .map(input => this.validate(input))
      .filter(e => e.errors.length);
    this.getParentElement().requestUpdate();
    return inputs;
  }

  private updateValueAndValidityOnEvent(method: Function) {
    const self = this;
    return function(
      this: HTMLInputElement,
      event: { target: HTMLInputElement }
    ) {
      const hasMultipleBindings = [
        ...((self
          .getFormElement()
          .querySelectorAll(`input[name="${this.name}"]`) as any) as Map<
          string,
          NodeListOf<Element>
        >).values()
      ].length;
      let value = this.value;
      if (
        hasMultipleBindings === 1 &&
        (this.type === 'checkbox' || this.type === 'radio')
      ) {
        value = String(this.checked);
      }

      if (self.options.multi && hasMultipleBindings > 1) {
        [
          ...((<never>(
            self.getFormElement().querySelectorAll('input:checked')
          )) as Map<string, HTMLInputElement>).values()
        ].forEach(el => (el.checked = false));
        this.checked = true;
      }
      const parentElement = self.getParentElement();
      const form = self.getFormElement();
      self.resetErrors();
      const { errors } = self.validate(this);
      if (errors.length) {
        form.invalid = true;
        form.valid = false;
      } else {
        self.errors[this.name] = {} as E;
        form.invalid = false;
        form.valid = true;
        self.setValue(this.name, value);
      }
      parentElement.requestUpdate();
      return method.call(parentElement, event);
    };
  }

  public querySelectForm(shadowRoot: HTMLElement): HTMLFormElement {
    const form = shadowRoot.querySelector(
      `form[name="${this.options.name}"]`
    ) as HTMLFormElement;
    if (!form) {
      throw new Error(
        `Form element with name "${this.options.name}" not present inside ${
          this.getParentElement().outerHTML
        } component`
      );
    }
    form.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    });
    return form;
  }

  public querySelectorAllInputs() {
    return [
      ...((<never>this.form.querySelectorAll('input')) as Map<
        string,
        HTMLInputElement
      >).values()
    ]
      .filter(el => this.isInputPresentOnStage(el))
      .filter(el => !!el.name);
  }

  public mapEventToInputs(inputs: HTMLElement[] = []) {
    return inputs.map((el: HTMLInputElement) => {
      if (!el[`on${this.options.strategy}`]) {
        el[`on${this.options.strategy}`] = function() {};
      }
      el[`on${this.options.strategy}`] = this.updateValueAndValidityOnEvent(
        el[`on${this.options.strategy}`]
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

  public validate(input: HTMLInputElement) {
    const validators = this.validators.get(input.name);
    let errors = [];
    if (validators && validators.length) {
      errors = validators
        .map(v => {
          this.errors[input.name] = this.errors[input.name] || {};
          const error = v.bind(this.getParentElement())(input);
          if (error && error.key) {
            this.errors[input.name][error.key] = error.message;
            this.errorMap.set(v, error.key);
            return { key: error.key, message: error.message };
          } else if (this.errorMap.has(v)) {
            delete this.errors[input.name][this.errorMap.get(v)];
          }
        })
        .filter(i => !!i);
    }
    if (!errors.length) {
      return { errors: [] };
    }
    return { element: input, errors };
  }

  public get(name: keyof T) {
    return this.inputs.get(name);
  }

  public getError(inputName: keyof T, errorKey: keyof E) {
    return this.errors[inputName][errorKey as never];
  }

  public hasError(inputName: keyof T, errorKey: keyof E) {
    return !!this.getError(inputName, errorKey as never);
  }

  public reset() {
    this.form.reset();
    this.resetErrors();
    this.setFormValidity();
  }

  public setFormValidity(validity: boolean = true) {
    this.valid = validity;
    this.invalid = !validity;
  }

  public resetErrors() {
    this.errors = Object.keys(this.errors).reduce((object, key) => {
      object[key] = {};
      return object;
    }, {}) as T;
  }

  public get value() {
    return this._valueChanges.getValue();
  }

  public set value(value: T) {
    this._valueChanges.next(value);
  }

  // public unsubscribe() {
  //   this._valueChanges.unsubscribe();
  // }
  // public subscribe() {
  //   this._valueChanges.subscribe();
  // }

  public getValue(name: keyof T): T[keyof T] {
    return this.value[name];
  }

  public setValue(name: string, value: string | boolean | number) {
    const values = this.value;
    values[name] = value;
    this.value = values;
    return values;
  }

  public setFormValue(value: T) {
    this.value = value;
  }

  public setElement(form: HTMLFormElement) {
    this.form = form;
  }

  public setInputs(inputs: HTMLInputElement[]) {
    this.inputs = new Map<keyof T, HTMLInputElement>(
      inputs.map(e => [e.name as keyof T, e])
    );
  }

  public getFormElement() {
    return this.form;
  }
}
