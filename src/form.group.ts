import { FormInputOptions, FormOptions, ErrorObject } from './form.tokens';
import { LitElement } from '@rxdi/lit-html';
import { BehaviorSubject } from './rx-fake';

export class FormGroup<T = FormInputOptions, E = { [key: string]: never }> {
  public validators: Map<string, Function[]> = new Map();
  public valid: boolean = true;
  public invalid: boolean = false;
  public errors: T = {} as T;

  private readonly _valueChanges: BehaviorSubject<T>;
  private form: HTMLFormElement;
  private errorMap = new Map();
  private inputs: Map<keyof T, HTMLInputElement> = new Map();
  private options: FormOptions = {} as FormOptions;
  private parentElement: LitElement;

  constructor(value?: T, errors?: E) {
    this._valueChanges = new BehaviorSubject<T>(value);
  }

  public prepareValues() {
    Object.keys(this.value).forEach(v => {
      const value = this.value[v];
      this.errors[v] = this.errors[v] || {};
      if (value.constructor === Array) {
        if (value[1].constructor === Array) {
          value[1].forEach(val => {
            const oldValidators = this.validators.get(v) || [];
            this.validators.set(v, [...oldValidators, val]);
          });
        }
        if (
          value[0].constructor === String ||
          value[0].constructor === Number ||
          value[0].constructor === Boolean
        ) {
          (this.value[v] as any) = value[0];
        } else {
          throw new Error(
            `Input value must be of type 'string', 'boolean' or 'number'`
          );
        }
      }
    });
    return this;
  }

  public setParentElement(parent: LitElement) {
    this.parentElement = parent;
    return this;
  }

  public getParentElement() {
    return this.parentElement;
  }

  public setOptions(options: FormOptions) {
    this.options = options;
    return this;
  }

  public getOptions() {
    return this.options;
  }

  public get valueChanges() {
    return this._valueChanges.asObservable();
  }

  public updateValueAndValidity() {
    this.resetErrors();
    const inputs = this.querySelectorAllInputs()
      .map(i => {
        i.setCustomValidity('');
        return i;
      })
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
      self.resetErrors();
      const isValid = self.applyValidationContext(self.validate(this));
      if (isValid) {
        self.setValue(this.name, value);
      }
      self.parentElement.requestUpdate();
      return method.call(self.parentElement, event);
    };
  }

  applyValidationContext({ errors, element }: ErrorObject) {
    const form = this.getFormElement();
    if (errors.length) {
      this.invalid = form.invalid = true;
      this.valid = form.valid = false;
      return false;
    } else {
      this.errors[element.name] = {} as E;
      this.invalid = form.invalid = false;
      this.valid = form.valid = true;
      return true;
    }
  }

  public querySelectForm(
    shadowRoot: HTMLElement | ShadowRoot
  ): HTMLFormElement {
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
      const strategy = `on${this.options.strategy}`;
      if (!el[strategy]) {
        el[strategy] = function() {};
      }
      el[strategy] = this.updateValueAndValidityOnEvent(el[strategy]);
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

  public validate(element: HTMLInputElement): ErrorObject {
    const validators = this.validators.get(element.name);
    let errors = [];
    if (validators && validators.length) {
      errors = validators
        .map(v => {
          this.errors[element.name] = this.errors[element.name] || {};
          const error = v.bind(this.getParentElement())(element);
          if (error && error.key) {
            this.errors[element.name][error.key] = error.message;
            this.errorMap.set(v, error.key);
            return { key: error.key, message: error.message };
          } else if (this.errorMap.has(v)) {
            delete this.errors[element.name][this.errorMap.get(v)];
          }
        })
        .filter(i => !!i);
    }
    if (!errors.length) {
      element.setCustomValidity('');
      return { errors: [], element };
    }
    element.setCustomValidity(errors[0].message);
    return { element, errors };
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
    this.errorMap.clear();
  }

  public get value() {
    return this._valueChanges.getValue();
  }

  public set value(value: T) {
    this._valueChanges.next(value);
  }

  public unsubscribe() {
    this.reset();
    this.updateValueAndValidity();
    // this._valueChanges.unsubscribe();
  }
  public subscribe() {
    this._valueChanges.subscribe();
  }

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

  public setFormElement(form: HTMLFormElement) {
    this.form = form;
    return this;
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
