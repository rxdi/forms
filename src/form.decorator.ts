import { FormOptions } from './form.tokens';
import { FormGroup } from './form.group';
import { noop } from './rx-fake';

export function Form(
  options: FormOptions = {
    strategy: 'none'
  } as any
) {
  return function(clazz: Object, name: string | number | symbol) {
    if (!options.name) {
      throw new Error('Missing form name');
    }

    const Destroy = clazz.constructor.prototype.disconnectedCallback || noop;
    const UpdateFirst = clazz.constructor.prototype.firstUpdated || noop;
    const Connect = clazz.constructor.prototype.connectedCallback || noop;

    clazz.constructor.prototype.connectedCallback = function() {
      if (!(this[name] instanceof FormGroup)) {
        throw new Error('Value provided is not an instance of FormGroup!');
      }
      (this[name] as FormGroup).setOptions(options).prepareValues();
      return Connect.call(this);
    };

    clazz.constructor.prototype.firstUpdated = function() {
      const form = this[name] as FormGroup;
      form
        .setParentElement(this)
        .setFormElement(form.querySelectForm(this.shadowRoot || this))
        .setInputs(form.mapEventToInputs(form.querySelectorAllInputs()));
      return UpdateFirst.call(this);
    };

    clazz.constructor.prototype.disconnectedCallback = function() {
      (this[name] as FormGroup).unsubscribe();
      return Destroy.call(this);
    };
  };
}
