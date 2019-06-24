"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateValueAndValidity = function (method, formGroup, parentElement) {
    return function (event) {
        const value = this.type === 'checkbox' ? this.checked : this.value;
        this.setAttribute('value', value);
        const form = formGroup.getFormElement();
        const errors = formGroup.validate(parentElement, this);
        if (errors.length) {
            form.invalid = true;
        }
        else {
            formGroup.errors[this.name] = {};
            form.invalid = false;
            formGroup.setValue(this.name, value);
        }
        parentElement.requestUpdate();
        return method.call(parentElement, event);
    };
};
exports.isElementPresentOnShadowRoot = function (input, controller) {
    const isInputPresent = Object.keys(controller.value).filter(v => v === input.name);
    if (!isInputPresent.length) {
        throw new Error(`Missing input element with name ${input.innerHTML} for form ${controller.getFormElement().name}`);
    }
    return isInputPresent.length;
};
