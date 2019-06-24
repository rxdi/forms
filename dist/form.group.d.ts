import { Observable } from 'rxjs';
import { FormInputOptions } from './form.tokens';
import { LitElement } from '@rxdi/lit-html';
export declare class FormGroup<T = FormInputOptions> {
    validators: Map<string, Function[]>;
    valid: boolean;
    invalid: boolean;
    errors: T;
    private readonly _valueChanges;
    private form;
    private errorMap;
    private inputs;
    constructor(value?: T);
    readonly valueChanges: Observable<T>;
    validate(element: LitElement, input: HTMLInputElement): any[];
    get(name: keyof T): HTMLInputElement;
    getError(inputName: string, errorKey: string): any;
    hasError(inputName: string, errorKey: string): boolean;
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
