import { FormController } from './form.controller';
import { LitElement } from '@rxdi/lit-html';

export const updateValueAndValidity = function(
  method: Function,
  controller: FormController,
  parentElement: LitElement
) {
  return function(event: { target: HTMLInputElement }) {
    const value = this.type === 'checkbox' ? this.checked : this.value;
    const form = controller.getFormElement();

    const errors = controller.validate(parentElement, this);
    if (errors.length) {
      form.classList.add('has-error');
      form.invalid = true;
      parentElement.requestUpdate();
      return;
    } else {
      form.classList.remove('has-error');
      delete controller.errors[this.name];
      controller.setValue(this.name, value);
      form.invalid = false;
      parentElement.requestUpdate();
    }
    return method.call(parentElement, event);
  };
};

export const isElementPresentOnShadowRoot = function(
  input: HTMLInputElement,
  controller: FormController
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
