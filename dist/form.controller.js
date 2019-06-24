"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
class FormController {
    constructor() {
        this._valueChanges = new rxjs_1.BehaviorSubject({});
        this.validators = new Map();
        this.errors = {};
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
                    return this.errors[input.name];
                }
            })
                .filter(i => !!i);
        }
        return errors;
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
    getFormElement() {
        return this.form;
    }
}
exports.FormController = FormController;
