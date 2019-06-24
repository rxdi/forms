import { Observable } from 'rxjs';
import { LitElement } from '@rxdi/lit-html';
export declare class FormGroupController<T = {
    [key: string]: string;
}> {
    private readonly _valueChanges;
    private form;
    readonly valueChanges: Observable<T>;
    values: T;
    unsubscribe(): void;
    getValue(name: string): keyof T;
    setValue(name: string, value: any): T;
    setFormElement(form: HTMLFormElement): void;
    getFormElement(): HTMLFormElement;
}
export declare type FormStrategies = 'change' | 'input' | 'none';
export interface FormOptions {
    name: string;
    strategy?: FormStrategies;
}
export declare const updateValueAndValidity: (method: Function, controller: FormGroupController<{
    [key: string]: string;
}>, element: LitElement) => (event: {
    target: HTMLInputElement;
}) => any;
export declare const isElementPresentOnShadowRoot: (input: HTMLInputElement, controller: FormGroupController<{
    [key: string]: string;
}>) => number;
export declare function Form(options?: FormOptions): (this: LitElement, clazz: Object, name?: string | number | symbol) => void;
export declare class FormGroup<T = {
    [key: string]: string;
}> {
    values: T;
    name?: string;
    valueChanges: Observable<T>;
    constructor(values: T);
    getValue(name: keyof T): keyof T;
    setValue(name: keyof T, value: any): void;
}
