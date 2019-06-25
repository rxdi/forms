"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const form_group_1 = require("./form.group");
function Form(options = {
    strategy: 'none'
}) {
    return function (clazz, name) {
        if (!options.name) {
            throw new Error('Missing form name');
        }
        const formGroup = new form_group_1.FormGroup();
        formGroup.setOptions(options);
        const Destroy = clazz.constructor.prototype.OnDestroy || rxjs_1.noop;
        const Update = clazz.constructor.prototype.OnUpdateFirst || rxjs_1.noop;
        clazz.constructor.prototype.OnUpdateFirst = function () {
            formGroup.setParentElement(this);
            formGroup.setElement(formGroup.querySelectForm(this.shadowRoot));
            formGroup.setInputs(formGroup.querySelectorAllInputs());
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
                            value[0].constructor === Number ||
                            value[0].constructor === Boolean) {
                            form.value[v] = value[0];
                        }
                        else {
                            throw new Error(`Input value must be of type 'string', 'boolean' or 'number'`);
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
