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
                .filter(el => form_helpers_1.isElementPresentOnShadowRoot(el, controller))
                .filter(el => !!el.name)
                .forEach((el) => (el[`on${options.strategy}`] = form_helpers_1.updateValueAndValidity(el[`on${options.strategy}`] || function () { }, controller, this)));
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
            set(form) {
                Object.keys(form.value).forEach(v => {
                    const value = form.value[v];
                    if (value.constructor === Array) {
                        if (value[1].constructor === Array) {
                            value[1].forEach(val => {
                                const oldValidators = controller.validators.get(v) || [];
                                controller.validators.set(v, [...oldValidators, val]);
                            });
                        }
                        form.value[v] = value[0];
                    }
                });
                controller.value = form.value;
            },
            configurable: true,
            enumerable: true
        });
    };
}
exports.Form = Form;
