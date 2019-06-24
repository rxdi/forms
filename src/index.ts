import { BehaviorSubject, Observable } from 'rxjs';
import { UpdatingElement, LitElement } from '@rxdi/lit-html';

export class FormGroupController<T = { [key: string]: string }> {
  private readonly _valueChanges: BehaviorSubject<T> = new BehaviorSubject(
    {} as any
  );

  private form: HTMLFormElement;

  get valueChanges() {
    return this._valueChanges.asObservable();
  }

  get values() {
    return this._valueChanges.getValue();
  }

  set values(value: T) {
    this._valueChanges.next(value);
  }

  unsubscribe() {
    this._valueChanges.unsubscribe();
  }

  getValue(name: string): keyof T {
    return this.values[name];
  }

  setValue(name: string, value: any) {
    const values = this.values;
    values[name] = value;
    this.values = values;
    return values;
  }

  setFormElement(form: HTMLFormElement) {
    this.form = form;
  }

  getFormElement() {
    return this.form;
  }
}

export type FormStrategies = 'change' | 'input' | 'none';

export interface FormOptions {
  name: string;
  strategy?: FormStrategies;
}
export const updateValueAndValidity = function(
  method: Function,
  controller: FormGroupController,
  element: LitElement
) {
  return function(event: { target: HTMLInputElement }) {
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;
    controller.setValue(event.target.name, value);
    element.requestUpdate();
    return method.call(element, event);
  };
};

export const isElementPresentOnShadowRoot = function(
  input: HTMLInputElement,
  controller: FormGroupController
) {
  const isInputPresent = Object.keys(controller.values).filter(
    v => v === input.name
  );
  if (!isInputPresent.length) {
    throw new Error(
      `Missing input element with name ${input.innerHTML} for form ${
        controller.getFormElement().name
      }`
    );
  }
  return isInputPresent.length;
};
const noop = function() {};
export function Form(
  options: FormOptions = {
    strategy: 'none'
  } as any
) {
  return function(
    this: LitElement,
    clazz: Object,
    name?: string | number | symbol
  ) {
    const controller = new FormGroupController();
    const originalDestroy = clazz.constructor.prototype.OnDestroy || noop;
    const originalUpdate = clazz.constructor.prototype.OnUpdateFirst || noop;

    clazz.constructor.prototype.OnUpdateFirst = function() {
      if (!options.name) {
        throw new Error('Missing form name');
      }
      const form = this.shadowRoot.querySelector(
        `form[name="${options.name}"]`
      );
      controller.setFormElement(form);
      if (!form) {
        throw new Error(`Form element not present inside ${this}`);
      }
      const inputs = form.querySelectorAll('input');
      if (inputs.length) {
        [...inputs.values()]
          .filter(i => isElementPresentOnShadowRoot(i, controller))
          .filter(i => !!i.name)
          .forEach(
            (i: HTMLInputElement) =>
              (i[`on${options.strategy}`] = updateValueAndValidity(
                i[`on${options.strategy}`] || function() {},
                controller,
                this
              ))
          );
      }
      return originalUpdate.call(this);
    };
    clazz.constructor.prototype.OnDestroy = function() {
      controller.unsubscribe();
      return originalDestroy.call(this);
    };
    Object.defineProperty(clazz.constructor.prototype, name, {
      get(): FormGroupController {
        return controller;
      },
      set(this: UpdatingElement, value: FormGroup) {
        controller.values = value.values;
      },
      configurable: true,
      enumerable: true
    });
  };
}

export class FormGroup<T = { [key: string]: string }> {
  name?: string;
  valueChanges: Observable<T>;
  constructor(public values: T) {}
  getValue(name: keyof T): keyof T {
    return;
  }
  setValue(name: keyof T, value: any) {}
}
