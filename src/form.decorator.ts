import { LitElement, UpdatingElement } from '@rxdi/lit-html';
import { FormOptions } from './form.tokens';
import { FormController } from './form.controller';
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
    const controller = new FormController();
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
      controller.setFormElement(form);
      [...form.querySelectorAll('input').values()]
        .filter(el => isElementPresentOnShadowRoot(el, controller))
        .filter(el => !!el.name)
        .forEach(
          (el: HTMLInputElement) =>
            (el[`on${options.strategy}`] = updateValueAndValidity(
              el[`on${options.strategy}`] || function() {},
              controller,
              this
            ))
        );
      return Update.call(this);
    };
    clazz.constructor.prototype.OnDestroy = function() {
      controller.unsubscribe();
      return Destroy.call(this);
    };
    Object.defineProperty(clazz.constructor.prototype, name, {
      get(): FormController {
        return controller;
      },
      set(this: UpdatingElement, form: FormGroup) {
        Object.keys(form.value).forEach(v => {
          const value = form.value[v];
          if (value.constructor === Array) {
            if (value[1].constructor === Array) {
              value[1].forEach(val => {
                const oldValidators = controller.validators.get(v) || [];
                controller.validators.set(v, [...oldValidators, val]);
              });
            }
            form.value[v] = value[0] as any;
          }
        });
        controller.value = form.value;
      },
      configurable: true,
      enumerable: true
    });
  };
}
