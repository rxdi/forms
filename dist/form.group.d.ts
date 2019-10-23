import { FormInputOptions, FormOptions, ErrorObject } from './form.tokens';
import { LitElement } from '@rxdi/lit-html';
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
    init(): void;
    prepareValues(): this;
    setParentElement(parent: LitElement): this;
    getParentElement(): LitElement;
    setOptions(options: FormOptions): this;
    getOptions(): FormOptions;
    readonly valueChanges: import("rxjs").Observable<T>;
    updateValueAndValidity(): ErrorObject[];
    private updateValueAndValidityOnEvent;
    applyValidationContext({ errors, element }: ErrorObject): boolean;
    querySelectForm(shadowRoot: HTMLElement | ShadowRoot): HTMLFormElement;
    querySelectorAllInputs(): HTMLInputElement[];
    mapEventToInputs(inputs?: HTMLElement[]): HTMLInputElement[];
    setElementDirty(input: HTMLInputElement): void;
    isInputPresentOnStage(input: HTMLInputElement): number;
    validate(element: HTMLInputElement): ErrorObject;
    private mapInputErrors;
    get(name: keyof T): HTMLInputElement;
    getError(inputName: keyof T, errorKey: keyof E): never;
    hasError(inputName: keyof T, errorKey: keyof E): boolean;
    reset(): void;
    setFormValidity(validity?: boolean): void;
    resetErrors(): void;
    value: T;
    unsubscribe(): void;
    getValue(name: keyof T): T[keyof T];
    setValue(name: keyof T, value: string | boolean | number): T;
    setFormValue(value: T): void;
    setFormElement(form: HTMLFormElement): this;
    setInputs(inputs: HTMLInputElement[]): void;
    getFormElement(): HTMLFormElement;
}
