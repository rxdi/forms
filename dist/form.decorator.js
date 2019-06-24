"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const form_controller_1 = require("./form.controller");
const form_helpers_1 = require("./form.helpers");
const rxjs_1 = require("rxjs");
function Form(options = {
    strategy: 'none'
}) {
    return function (clazz, name) {
        const controller = new form_controller_1.FormController();
        const Destroy = clazz.constructor.prototype.OnDestroy || rxjs_1.noop;
        const Update = clazz.constructor.prototype.OnUpdateFirst || rxjs_1.noop;
        clazz.constructor.prototype.OnUpdateFirst = function () {
            if (!options.name) {
                throw new Error('Missing form name');
            }
            const form = this.shadowRoot.querySelector(`form[name="${options.name}"]`);
            if (!form) {
                throw new Error(`Form element not present inside ${this}`);
            }
            controller.setFormElement(form);
            [...form.querySelectorAll('input').values()]
                .filter(i => form_helpers_1.isElementPresentOnShadowRoot(i, controller))
                .filter(i => !!i.name)
                .forEach((i) => (i[`on${options.strategy}`] = form_helpers_1.updateValueAndValidity(i[`on${options.strategy}`] || function () { }, controller, this)));
            return Update.call(this);
        };
        clazz.constructor.prototype.OnDestroy = function () {
            controller.unsubscribe();
            return Destroy.call(this);
        };
        Object.defineProperty(clazz.constructor.prototype, name, {
            get() {
                return controller;
            },
            set(value) {
                controller.value = value.value;
            },
            configurable: true,
            enumerable: true
        });
    };
}
exports.Form = Form;
