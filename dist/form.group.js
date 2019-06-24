"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
class FormGroup {
    constructor(value) {
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
