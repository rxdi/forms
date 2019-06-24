import { BehaviorSubject, Observable } from 'rxjs';
import { UpdatingElement } from '@rxdi/lit-html';

export class FormGroupController<T = { [key: string]: string }> {
  private readonly _valueChanges: BehaviorSubject<T> = new BehaviorSubject(
    {} as any
  );

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
    return this.valueChanges[name];
  }

  setValue(name: string, value: any) {
    const values = this.values;
    values[name] = value;
    this.values = values;
    return values;
  }
}

export type FormStrategies = 'change' | 'input' | 'none';

export interface FormOptions {
  name: string;
  strategy?: FormStrategies;
}

export function Form(
  options: FormOptions = {
    strategy: 'none'
  } as any
) {
  return (protoOrDescriptor: Object, name?: string | number | symbol) => {
    const controller = new FormGroupController();
    Object.defineProperty(protoOrDescriptor.constructor.prototype, name, {
      // tslint:disable-next-line:no-any no symbol in index
      get(): FormGroupController {
        return controller;
      },
      set(this: UpdatingElement, value: FormGroup) {
        controller.values = value.values;
      },
      configurable: true,
      enumerable: true
    });
    const originalDestroy = protoOrDescriptor.constructor.prototype.OnDestroy;
    const originalUpdate =
      protoOrDescriptor.constructor.prototype.OnUpdateFirst || function() {};

    protoOrDescriptor.constructor.prototype.OnUpdateFirst = function() {
      const self = this;
      if (!options.name) {
        throw new Error('Missing form name');
      }
      const form = this.shadowRoot.querySelector(
        `form[name="${options.name}"]`
      );
      if (!form) {
        throw new Error(`Form element not present inside ${this}`);
      }
      const inputs = form.querySelectorAll('input');
      if (inputs.length) {
        const isPresentOnStage = (input: HTMLInputElement) => {
          const isInputPresent = Object.keys(controller.values).filter(
            v => v === input.name
          );
          if (!isInputPresent.length) {
            throw new Error(
              `Missing input element with name ${input.innerHTML} for form ${
                options.name
              }`
            );
          }
          return isInputPresent.length;
        };
        const filtered = [...inputs.values()]
          .filter(i => isPresentOnStage(i))
          .filter(i => !!i.name);
        if (filtered.length) {
          const updateValueAndValidity = (method: Function) =>
            function(event: { target: HTMLInputElement }) {
              const value =
                event.target.type === 'checkbox'
                  ? event.target.checked
                  : event.target.value;
              controller.setValue(event.target.name, value);
              self._requestUpdate();
              return method.call(this, event);
            } as any;
          filtered.forEach((i: HTMLInputElement) => {
            if (options.strategy === 'change') {
              i.onchange = updateValueAndValidity(i.onchange || function() {});
            } else if (options.strategy === 'input') {
              i.oninput = updateValueAndValidity(i.oninput || function() {});
            }
          });
        }
      }
      return originalUpdate();
    };
    protoOrDescriptor.constructor.prototype.OnDestroy = function() {
      controller.unsubscribe();
      return originalDestroy();
    };
  };
}

export class FormGroup<T = { [key: string]: string }> {
  name?: string;
  valueChanges: Observable<T>;
  constructor(public values: T) {}
  getValue(name: string): keyof T {
    return;
  }
  setValue(name: string, value: any) {}
}
