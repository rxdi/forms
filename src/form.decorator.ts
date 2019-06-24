import { UpdatingElement } from '@rxdi/lit-html';
import { FormOptions } from './form.tokens';
import {
  isElementPresentOnShadowRoot,
  updateValueAndValidity
} from './form.helpers';
import { noop } from 'rxjs';
import { FormGroup } from './form.group';

export function Form(
  options: FormOptions = {
    strategy: 'none'
  } as any
) {
  return function(clazz: Object, name: string | number | symbol) {
    const formGroup = new FormGroup();
    const Destroy = clazz.constructor.prototype.OnDestroy || noop;
    const Update = clazz.constructor.prototype.OnUpdateFirst || noop;
    clazz.constructor.prototype.OnUpdateFirst = function() {
      if (!options.name) {
        throw new Error('Missing form name');
      }
      const form = this.shadowRoot.querySelector(
        `form[name="${options.name}"]`
      );
      if (!form) {
        throw new Error(`Form element not present inside ${this}`);
      }
      formGroup.setFormElement(form);
      const inputs = [...form.querySelectorAll('input').values()]
        .filter(el => isElementPresentOnShadowRoot(el, formGroup))
        .filter(el => !!el.name)
        .map((el: HTMLInputElement) => {
          el[`on${options.strategy}`] = updateValueAndValidity(
            el[`on${options.strategy}`] || function() {},
            formGroup,
            this
          );
          return el;
        });
        formGroup.setFormInputs(inputs);
      return Update.call(this);
    };
    clazz.constructor.prototype.OnDestroy = function() {
      // controller.unsubscribe();
      return Destroy.call(this);
    };
    Object.defineProperty(clazz.constructor.prototype, name, {
      get(): FormGroup {
        return formGroup;
      },
      set(this: UpdatingElement, form: FormGroup) {
        Object.keys(form.value).forEach(v => {
          const value = form.value[v];
          this[name].errors[v] = this[name].errors[v] || {};
          if (value.constructor === Array) {
            if (value[1].constructor === Array) {
              value[1].forEach(val => {
                const oldValidators = formGroup.validators.get(v) || [];
                formGroup.validators.set(v, [...oldValidators, val]);
              });
            }
            if (
              value[0].constructor === String ||
              value[0].constructor === Number
            ) {
              (form.value[v] as any) = value[0] as string | number;
            } else {
              throw new Error(
                `Input value must be of type 'string' or 'number'`
              );
            }
          }
        });
        formGroup.value = form.value;

      },
      configurable: true,
      enumerable: true
    });
  };
}
