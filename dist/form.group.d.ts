import { FormInputOptions, FormOptions } from './form.tokens';
import { LitElement } from '@rxdi/lit-html';
export declare class FormGroup<T = FormInputOptions, E = {
    [key: string]: any;
}> {
    validators: Map<string, Function[]>;
    valid: boolean;
    invalid: boolean;
    errors: T;
    private readonly _valueChanges;
    private form;
    private errorMap;
    private inputs;
    private options;
    private parentElement;
    constructor(value?: T, errors?: keyof E);
    setParentElement(parent: LitElement): void;
    getParentElement(): LitElement;
    setOptions(options: FormOptions): void;
    getOptions(): FormOptions;
    readonly valueChanges: import("rxjs").Observable<T>;
    updateValueAndValidity(): ({
        errors: any[];
        element?: undefined;
    } | {
        element: HTMLInputElement;
        errors: any[];
    })[];
    private updateValueAndValidityOnEvent;
    querySelectForm(shadowRoot: HTMLElement): HTMLFormElement;
    querySelectorAllInputs(): HTMLInputElement[];
    isInputPresentOnStage(input: HTMLInputElement): number;
    validate(input: HTMLInputElement): {
        errors: any[];
        element?: undefined;
    } | {
        element: HTMLInputElement;
        errors: any[];
    };
    get(name: keyof T): HTMLInputElement;
    getError(inputName: keyof T, errorKey: keyof E): any;
    hasError(inputName: keyof T, errorKey: keyof E): boolean;
    reset(): void;
    value: T;
    unsubscribe(): void;
    subscribe(): void;
    getValue(name: keyof T): T[keyof T];
    setValue(name: string, value: any): T;
    setFormValue(value: T): void;
    setElement(form: HTMLFormElement): void;
    setInputs(inputs: HTMLInputElement[]): void;
    getFormElement(): HTMLFormElement;
}
