"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateValueAndValidity = function (method, controller, element) {
    return function (event) {
        const value = event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value;
        controller.setValue(event.target.name, value);
        element.requestUpdate();
        return method.call(element, event);
    };
};
exports.isElementPresentOnShadowRoot = function (input, controller) {
    const isInputPresent = Object.keys(controller.value).filter(v => v === input.name);
    if (!isInputPresent.length) {
        throw new Error(`Missing input element with name ${input.innerHTML} for form ${controller.getFormElement().name}`);
    }
    return isInputPresent.length;
};
