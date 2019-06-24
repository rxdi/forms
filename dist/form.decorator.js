"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const form_helpers_1 = require("./form.helpers");
const rxjs_1 = require("rxjs");
const form_group_1 = require("./form.group");
function Form(options = {
    strategy: 'none'
}) {
    return function (clazz, name) {
        const formGroup = new form_group_1.FormGroup();
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
            formGroup.setFormElement(form);
            const inputs = [...form.querySelectorAll('input').values()]
                .filter(el => form_helpers_1.isElementPresentOnShadowRoot(el, formGroup))
                .filter(el => !!el.name)
                .map((el) => {
                el[`on${options.strategy}`] = form_helpers_1.updateValueAndValidity(el[`on${options.strategy}`] || function () { }, formGroup, this);
                return el;
            });
            formGroup.setFormInputs(inputs);
            return Update.call(this);
        };
        clazz.constructor.prototype.OnDestroy = function () {
            // controller.unsubscribe();
            return Destroy.call(this);
        };
        Object.defineProperty(clazz.constructor.prototype, name, {
            get() {
                return formGroup;
            },
            set(form) {
                Object.keys(form.value).forEach(v => {
                    const value = form.value[v];
                    this[name].errors[v] = this[name].errors[v] || {};
                    if (value.constructor === Array) {
                        if (value[1].constructor === Array) {
                            value[1].forEach(val => {
                                const oldValidators = formGroup.validators.get(v) || [];
                                formGroup.validators.set(v, [...oldValidators, val]);
                            });
                        }
                        if (value[0].constructor === String ||
                            value[0].constructor === Number) {
                            form.value[v] = value[0];
                        }
                        else {
                            throw new Error(`Input value must be of type 'string' or 'number'`);
                        }
                    }
                });
                formGroup.value = form.value;
            },
            configurable: true,
            enumerable: true
        });
    };
}
exports.Form = Form;
