"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
class FormGroupController {
    constructor() {
        this._valueChanges = new rxjs_1.BehaviorSubject({});
    }
    get valueChanges() {
        return this._valueChanges.asObservable();
    }
    get values() {
        return this._valueChanges.getValue();
    }
    set values(value) {
        this._valueChanges.next(value);
    }
    unsubscribe() {
        this._valueChanges.unsubscribe();
    }
    getValue(name) {
        return this.values[name];
    }
    setValue(name, value) {
        const values = this.values;
        values[name] = value;
        this.values = values;
        return values;
    }
    setFormElement(form) {
        this.form = form;
    }
    getFormElement() {
        return this.form;
    }
}
exports.FormGroupController = FormGroupController;
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
    const isInputPresent = Object.keys(controller.values).filter(v => v === input.name);
    if (!isInputPresent.length) {
        throw new Error(`Missing input element with name ${input.innerHTML} for form ${controller.getFormElement().name}`);
    }
    return isInputPresent.length;
};
const noop = function () { };
function Form(options = {
    strategy: 'none'
}) {
    return function (clazz, name) {
        const controller = new FormGroupController();
        const originalDestroy = clazz.constructor.prototype.OnDestroy || noop;
        const originalUpdate = clazz.constructor.prototype.OnUpdateFirst || noop;
        clazz.constructor.prototype.OnUpdateFirst = function () {
            if (!options.name) {
                throw new Error('Missing form name');
            }
            const form = this.shadowRoot.querySelector(`form[name="${options.name}"]`);
            controller.setFormElement(form);
            if (!form) {
                throw new Error(`Form element not present inside ${this}`);
            }
            const inputs = form.querySelectorAll('input');
            if (inputs.length) {
                [...inputs.values()]
                    .filter(i => exports.isElementPresentOnShadowRoot(i, controller))
                    .filter(i => !!i.name)
                    .forEach((i) => (i[`on${options.strategy}`] = exports.updateValueAndValidity(i[`on${options.strategy}`] || function () { }, controller, this)));
            }
            return originalUpdate.call(this);
        };
        clazz.constructor.prototype.OnDestroy = function () {
            controller.unsubscribe();
            return originalDestroy.call(this);
        };
        Object.defineProperty(clazz.constructor.prototype, name, {
            get() {
                return controller;
            },
            set(value) {
                controller.values = value.values;
            },
            configurable: true,
            enumerable: true
        });
    };
}
exports.Form = Form;
class FormGroup {
    constructor(values) {
        this.values = values;
    }
    getValue(name) {
        return;
    }
    setValue(name, value) { }
}
exports.FormGroup = FormGroup;
