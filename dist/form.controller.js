"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
class FormController {
    constructor() {
        this._valueChanges = new rxjs_1.BehaviorSubject({});
    }
    get valueChanges() {
        return this._valueChanges.asObservable();
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
