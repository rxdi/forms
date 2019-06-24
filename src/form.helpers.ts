import { LitElement } from '@rxdi/lit-html';
import { FormGroup } from './form.group';

export const updateValueAndValidity = function(
  method: Function,
  formGroup: FormGroup,
  parentElement: LitElement
) {
  return function(this: HTMLInputElement, event: { target: HTMLInputElement }) {
    const value = this.type === 'checkbox' ? this.checked : this.value;
    this.setAttribute('value', value as any);
    const form = formGroup.getFormElement();
    const errors = formGroup.validate(parentElement, this);
    if (errors.length) {
      form.invalid = true;
    } else {
      formGroup.errors[this.name] = {} as any;
      form.invalid = false;
      formGroup.setValue(this.name, value);
    }
    parentElement.requestUpdate();
    return method.call(parentElement, event);
  };
};

export const isElementPresentOnShadowRoot = function(
  input: HTMLInputElement,
  controller: FormGroup
) {
  const isInputPresent = Object.keys(controller.value).filter(
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
