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
    constructor(value?: T, errors?: E);
    readonly valueChanges: import("rxjs").Observable<T>;
    updateValueAndValidity(method: Function, parentElement: LitElement, multi?: boolean): (this: HTMLInputElement, event: {
        target: HTMLInputElement;
    }) => any;
    querySelectForm(shadowRoot: HTMLElement, options: FormOptions): HTMLFormElement;
    querySelectorAllInputs(self: LitElement, options: FormOptions): HTMLInputElement[];
    isInputPresentOnStage(input: HTMLInputElement): number;
    validate(element: LitElement, input: HTMLInputElement): any[];
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
    setFormElement(form: HTMLFormElement): void;
    setFormInputs(inputs: HTMLInputElement[]): void;
    getFormElement(): HTMLFormElement;
}
