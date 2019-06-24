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
        return this.valueChanges[name];
    }
    setValue(name, value) {
        const values = this.values;
        values[name] = value;
        this.values = values;
        return values;
    }
}
exports.FormGroupController = FormGroupController;
function Form(options = {
    strategy: 'none'
}) {
    return (protoOrDescriptor, name) => {
        const controller = new FormGroupController();
        Object.defineProperty(protoOrDescriptor.constructor.prototype, name, {
            // tslint:disable-next-line:no-any no symbol in index
            get() {
                return controller;
            },
            set(value) {
                controller.values = value.values;
            },
            configurable: true,
            enumerable: true
        });
        const originalDestroy = protoOrDescriptor.constructor.prototype.OnDestroy;
        const originalUpdate = protoOrDescriptor.constructor.prototype.OnUpdateFirst || function () { };
        protoOrDescriptor.constructor.prototype.OnUpdateFirst = function () {
            const self = this;
            if (!options.name) {
                throw new Error('Missing form name');
            }
            const form = this.shadowRoot.querySelector(`form[name="${options.name}"]`);
            if (!form) {
                throw new Error(`Form element not present inside ${this}`);
            }
            const inputs = form.querySelectorAll('input');
            if (inputs.length) {
                const isPresentOnStage = (input) => {
                    const isInputPresent = Object.keys(controller.values).filter(v => v === input.name);
                    if (!isInputPresent.length) {
                        throw new Error(`Missing input element with name ${input.innerHTML} for form ${options.name}`);
                    }
                    return isInputPresent.length;
                };
                const filtered = [...inputs.values()]
                    .filter(i => isPresentOnStage(i))
                    .filter(i => !!i.name);
                if (filtered.length) {
                    const updateValueAndValidity = (method) => function (event) {
                        const value = event.target.type === 'checkbox'
                            ? event.target.checked
                            : event.target.value;
                        controller.setValue(event.target.name, value);
                        self._requestUpdate();
                        return method.call(this, event);
                    };
                    filtered.forEach((i) => {
                        if (options.strategy === 'change') {
                            i.onchange = updateValueAndValidity(i.onchange || function () { });
                        }
                        else if (options.strategy === 'input') {
                            i.oninput = updateValueAndValidity(i.oninput || function () { });
                        }
                    });
                }
            }
            return originalUpdate();
        };
        protoOrDescriptor.constructor.prototype.OnDestroy = function () {
            controller.unsubscribe();
            return originalDestroy();
        };
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
