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
      set(this: UpdatingElement, value: FormGroup) {
        controller.value = value.value;
      },
      configurable: true,
      enumerable: true
    });
  };
}
