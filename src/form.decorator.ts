import { UpdatingElement } from '@rxdi/lit-html';
import { FormOptions } from './form.tokens';
import { noop } from 'rxjs';
import { FormGroup } from './form.group';

export function Form(
  options: FormOptions = {
    strategy: 'none'
  } as any
) {
  return function(clazz: Object, name: string | number | symbol) {
    if (!options.name) {
      throw new Error('Missing form name');
    }
    const formGroup = new FormGroup();
    formGroup.setOptions(options);
    const Destroy = clazz.constructor.prototype.OnDestroy || noop;
    const Update = clazz.constructor.prototype.OnUpdateFirst || noop;
    clazz.constructor.prototype.OnUpdateFirst = function() {
      formGroup.setParentElement(this);
      formGroup.setElement(formGroup.querySelectForm(this.shadowRoot));
      formGroup.setInputs(formGroup.querySelectorAllInputs());
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
              value[0].constructor === Number ||
              value[0].constructor === Boolean
            ) {
              (form.value[v] as any) = value[0];
            } else {
              throw new Error(
                `Input value must be of type 'string', 'boolean' or 'number'`
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
