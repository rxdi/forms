"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateValueAndValidity = function (method, controller, parentElement) {
    return function (event) {
        const value = this.type === 'checkbox' ? this.checked : this.value;
        const form = controller.getFormElement();
        const errors = controller.validate(parentElement, this);
        if (errors.length) {
            form.classList.add('has-error');
            form.invalid = true;
            parentElement.requestUpdate();
            return;
        }
        else {
            form.classList.remove('has-error');
            delete controller.errors[this.name];
            controller.setValue(this.name, value);
            form.invalid = false;
            parentElement.requestUpdate();
        }
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
