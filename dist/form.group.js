"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
class FormGroup {
    constructor(value, errors) {
        this.validators = new Map();
        this.valid = true;
        this.invalid = false;
        this.errors = {};
        this._valueChanges = new rxjs_1.BehaviorSubject({});
        this.errorMap = new WeakMap();
        this.inputs = new Map();
        this.options = {};
        this.value = value;
    }
    setParentElement(parent) {
        this.parentElement = parent;
    }
    getParentElement() {
        return this.parentElement;
    }
    setOptions(options) {
        Object.assign(this.options, options);
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
                    ...self
                        .getFormElement()
                        .querySelectorAll('input:checked').values()
                ].forEach(el => (el.checked = false));
                this.checked = true;
            }
            const parentElement = self.getParentElement();
            const form = self.getFormElement();
            self.resetErrors();
            const { errors } = self.validate(this);
            if (errors.length) {
                form.invalid = true;
                form.valid = false;
            }
            else {
                self.errors[this.name] = {};
                form.invalid = false;
                form.valid = true;
                self.setValue(this.name, value);
            }
            parentElement.requestUpdate();
            return method.call(parentElement, event);
        };
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
            if (!el[`on${this.options.strategy}`]) {
                el[`on${this.options.strategy}`] = function () { };
            }
            el[`on${this.options.strategy}`] = this.updateValueAndValidityOnEvent(el[`on${this.options.strategy}`]);
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
    validate(input) {
        const validators = this.validators.get(input.name);
        let errors = [];
        if (validators && validators.length) {
            errors = validators
                .map(v => {
                this.errors[input.name] = this.errors[input.name] || {};
                const error = v.bind(this.getParentElement())(input);
                if (error && error.key) {
                    this.errors[input.name][error.key] = error.message;
                    this.errorMap.set(v, error.key);
                    return { key: error.key, message: error.message };
                }
                else if (this.errorMap.has(v)) {
                    delete this.errors[input.name][this.errorMap.get(v)];
                }
            })
                .filter(i => !!i);
        }
        if (!errors.length) {
            return { errors: [] };
        }
        return { element: input, errors };
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
    setElement(form) {
        this.form = form;
    }
    setInputs(inputs) {
        this.inputs = new Map(inputs.map(e => [e.name, e]));
    }
    getFormElement() {
        return this.form;
    }
}
exports.FormGroup = FormGroup;
