import { FormInputOptions } from './form.tokens';
import { LitElement } from '@rxdi/lit-html';
export declare class FormController<T = FormInputOptions> {
    private readonly _valueChanges;
    validators: Map<string, Function[]>;
    valid: boolean;
    invalid: boolean;
    errors: T[];
    private form;
    readonly valueChanges: import("rxjs").Observable<T>;
    validate(element: LitElement, input: HTMLInputElement): any[];
    reset(): void;
    value: T;
    unsubscribe(): void;
    getValue(name: keyof T): T[keyof T];
    setValue(name: string, value: any): T;
    setFormValue(value: T): void;
    setFormElement(form: HTMLFormElement): void;
    getFormElement(): HTMLFormElement;
}
