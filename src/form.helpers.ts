import { FormController } from './form.controller';
import { LitElement } from '@rxdi/lit-html';

export const updateValueAndValidity = function(
  method: Function,
  controller: FormController,
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
