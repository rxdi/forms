"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
class FormGroup {
    constructor(value, errors) {
        this.validators = new Map();
        this.errors = {};
        this._valueChanges = new rxjs_1.BehaviorSubject({});
        this.errorMap = new WeakMap();
        this.inputs = new Map();
        this.value = value;
    }
    get valueChanges() {
        return this._valueChanges.asObservable();
    }
    updateValueAndValidity(method, parentElement, multi = true) {
        const self = this;
        return function (event) {
            let value = this.value;
            const hasMultipleBindings = [
                ...self
                    .getFormElement()
                    .querySelectorAll(`input[name="${this.name}"]`).values()
            ].length;
            if (hasMultipleBindings === 1 &&
                (this.type === 'checkbox' || this.type === 'radio')) {
                value = String(this.checked);
            }
            if (multi && hasMultipleBindings > 1) {
                [
                    ...self
                        .getFormElement()
                        .querySelectorAll('input:checked').values()
                ].forEach(el => (el.checked = false));
                this.checked = true;
            }
            const form = self.getFormElement();
            const errors = self.validate(parentElement, this);
            if (errors.length) {
                form.invalid = true;
            }
            else {
                self.errors[this.name] = {};
                form.invalid = false;
                self.setValue(this.name, value);
            }
            parentElement.requestUpdate();
            return method.call(parentElement, event);
        };
    }
    querySelectForm(shadowRoot, options) {
        const form = shadowRoot.querySelector(`form[name="${options.name}"]`);
        if (!form) {
            throw new Error(`Form element not present inside ${this}`);
        }
        return form;
    }
    querySelectorAllInputs(self, options) {
        return [
            ...this.form.querySelectorAll('input').values()
        ]
            .filter(el => this.isInputPresentOnStage(el))
            .filter(el => !!el.name)
            .map((el) => {
            el.ondragleave;
            el[`on${options.strategy}`] = this.updateValueAndValidity(el[`on${options.strategy}`] || function () { }, self, options.multi);
            return el;
        });
    }
    isInputPresentOnStage(input) {
        const isInputPresent = Object.keys(this.value).filter(v => v === input.name);
        if (!isInputPresent.length) {
            throw new Error(`Missing input element with name ${input.name} for form ${this.getFormElement().name}`);
        }
        return isInputPresent.length;
    }
    validate(element, input) {
        const validators = this.validators.get(input.name);
        let errors = [];
        if (validators && validators.length) {
            errors = validators
                .map(v => {
                this.errors[input.name] = this.errors[input.name] || {};
                const error = v.bind(element)(input);
                if (error && error.key) {
                    this.errors[input.name][error.key] = error.message;
                    this.errorMap.set(v, error.key);
                    return this.errors[input.name];
                }
                else if (this.errorMap.has(v)) {
                    delete this.errors[input.name][this.errorMap.get(v)];
                }
            })
                .filter(i => !!i);
        }
        return errors;
    }
    get(name) {
        return this.inputs.get(name);
    }
    getError(inputName, errorKey) {
        return this.errors[inputName][errorKey];
    }
    hasError(inputName, errorKey) {
        return !!this.getError(inputName, errorKey);
    }
    reset() {
        this.form.reset();
        this.errors = {};
        this.valid = true;
        this.invalid = false;
    }
    get value() {
        return this._valueChanges.getValue();
    }
    set value(value) {
        this._valueChanges.next(value);
    }
    unsubscribe() {
        this._valueChanges.unsubscribe();
    }
    subscribe() {
        this._valueChanges.subscribe();
    }
    getValue(name) {
        return this.value[name];
    }
    setValue(name, value) {
        const values = this.value;
        values[name] = value;
        this.value = values;
        return values;
    }
    setFormValue(value) {
        this.value = value;
    }
    setFormElement(form) {
        this.form = form;
    }
    setFormInputs(inputs) {
        this.inputs = new Map(inputs.map(e => [e.name, e]));
    }
    getFormElement() {
        return this.form;
    }
}
exports.FormGroup = FormGroup;
