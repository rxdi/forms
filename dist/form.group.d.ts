import { FormInputOptions, FormOptions } from './form.tokens';
import { LitElement } from '@rxdi/lit-html';
import { BehaviorSubject } from './rx-fake';
export declare class FormGroup<T = FormInputOptions, E = {
    [key: string]: never;
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
    constructor(value?: T, errors?: E);
    setParentElement(parent: LitElement): void;
    getParentElement(): LitElement;
    setOptions(options: FormOptions): void;
    getOptions(): FormOptions;
    readonly valueChanges: BehaviorSubject<T>;
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
    mapEventToInputs(inputs?: HTMLElement[]): HTMLInputElement[];
    isInputPresentOnStage(input: HTMLInputElement): number;
    validate(input: HTMLInputElement): {
        errors: any[];
        element?: undefined;
    } | {
        element: HTMLInputElement;
        errors: any[];
    };
    get(name: keyof T): HTMLInputElement;
    getError(inputName: keyof T, errorKey: keyof E): never;
    hasError(inputName: keyof T, errorKey: keyof E): boolean;
    reset(): void;
    setFormValidity(validity?: boolean): void;
    resetErrors(): void;
    value: T;
    getValue(name: keyof T): T[keyof T];
    setValue(name: string, value: string | boolean | number): T;
    setFormValue(value: T): void;
    setElement(form: HTMLFormElement): void;
    setInputs(inputs: HTMLInputElement[]): void;
    getFormElement(): HTMLFormElement;
}
