"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rx_fake_1 = require("./rx-fake");
class FormGroup {
    constructor(value, errors) {
        this.validators = new Map();
        this.valid = true;
        this.invalid = false;
        this.errors = {};
        this.errorMap = new Map();
        this.inputs = new Map();
        this.options = {};
        this._valueChanges = new rx_fake_1.BehaviorSubject(value);
    }
    prepareValues() {
        Object.keys(this.value).forEach(v => {
            const value = this.value[v];
            this.errors[v] = this.errors[v] || {};
            if (value.constructor === Array) {
                if (value[1].constructor === Array) {
                    value[1].forEach(val => {
                        const oldValidators = this.validators.get(v) || [];
                        this.validators.set(v, [...oldValidators, val]);
                    });
                }
                if (value[0].constructor === String ||
                    value[0].constructor === Number ||
                    value[0].constructor === Boolean) {
                    this.value[v] = value[0];
                }
                else {
                    throw new Error(`Input value must be of type 'string', 'boolean' or 'number'`);
                }
            }
        });
        return this;
    }
    setParentElement(parent) {
        this.parentElement = parent;
        return this;
    }
    getParentElement() {
        return this.parentElement;
    }
    setOptions(options) {
        this.options = options;
        return this;
    }
    getOptions() {
        return this.options;
    }
    get valueChanges() {
        return this._valueChanges.asObservable();
    }
    updateValueAndValidity() {
        this.resetErrors();
        const inputs = this.querySelectorAllInputs()
            .map(i => {
            i.setCustomValidity('');
            return i;
        })
            .map(input => this.validate(input))
            .filter(e => e.errors.length);
        this.getParentElement().requestUpdate();
        return inputs;
    }
    updateValueAndValidityOnEvent(method) {
        const self = this;
        return function (event) {
            const hasMultipleBindings = [
                ...self
                    .getFormElement()
                    .querySelectorAll(`input[name="${this.name}"]`).values()
            ].length;
            let value = this.value;
            if (hasMultipleBindings === 1 &&
                (this.type === 'checkbox' || this.type === 'radio')) {
                value = String(this.checked);
            }
            if (self.options.multi && hasMultipleBindings > 1) {
                [
                    ...(self.getFormElement().querySelectorAll('input:checked')).values()
                ].forEach(el => (el.checked = false));
                this.checked = true;
            }
            self.resetErrors();
            const isValid = self.applyValidationContext(self.validate(this));
            if (isValid) {
                self.setValue(this.name, value);
            }
            self.parentElement.requestUpdate();
            return method.call(self.parentElement, event);
        };
    }
    applyValidationContext({ errors, element }) {
        const form = this.getFormElement();
        if (errors.length) {
            this.invalid = form.invalid = true;
            this.valid = form.valid = false;
            return false;
        }
        else {
            this.errors[element.name] = {};
            this.invalid = form.invalid = false;
            this.valid = form.valid = true;
            return true;
        }
    }
    querySelectForm(shadowRoot) {
        const form = shadowRoot.querySelector(`form[name="${this.options.name}"]`);
        if (!form) {
            throw new Error(`Form element with name "${this.options.name}" not present inside ${this.getParentElement().outerHTML} component`);
        }
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        return form;
    }
    querySelectorAllInputs() {
        return [
            ...this.form.querySelectorAll('input').values()
        ]
            .filter(el => this.isInputPresentOnStage(el))
            .filter(el => !!el.name);
    }
    mapEventToInputs(inputs = []) {
        return inputs.map((el) => {
            const strategy = `on${this.options.strategy}`;
            if (!el[strategy]) {
                el[strategy] = function () { };
            }
            el[strategy] = this.updateValueAndValidityOnEvent(el[strategy]);
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
    validate(element) {
        const validators = this.validators.get(element.name);
        let errors = [];
        if (validators && validators.length) {
            errors = validators
                .map(v => {
                this.errors[element.name] = this.errors[element.name] || {};
                const error = v.bind(this.getParentElement())(element);
                if (error && error.key) {
                    this.errors[element.name][error.key] = error.message;
                    this.errorMap.set(v, error.key);
                    return { key: error.key, message: error.message };
                }
                else if (this.errorMap.has(v)) {
                    delete this.errors[element.name][this.errorMap.get(v)];
                }
            })
                .filter(i => !!i);
        }
        if (!errors.length) {
            element.setCustomValidity('');
            return { errors: [], element };
        }
        element.setCustomValidity(errors[0].message);
        return { element, errors };
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
        this.resetErrors();
        this.setFormValidity();
    }
    setFormValidity(validity = true) {
        this.valid = validity;
        this.invalid = !validity;
    }
    resetErrors() {
        this.errors = Object.keys(this.errors).reduce((object, key) => {
            object[key] = {};
            return object;
        }, {});
        this.errorMap.clear();
    }
    get value() {
        return this._valueChanges.getValue();
    }
    set value(value) {
        this._valueChanges.next(value);
    }
    unsubscribe() {
        this.reset();
        this._valueChanges.unsubscribe();
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
        return this;
    }
    setInputs(inputs) {
        this.inputs = new Map(inputs.map(e => [e.name, e]));
    }
    getFormElement() {
        return this.form;
    }
}
exports.FormGroup = FormGroup;
