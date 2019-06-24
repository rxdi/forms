import { LitElement } from '@rxdi/lit-html';
import { FormGroup } from './form.group';
export declare const updateValueAndValidity: (method: Function, formGroup: FormGroup<import("./form.tokens").FormInputOptions>, parentElement: LitElement) => (this: HTMLInputElement, event: {
    target: HTMLInputElement;
}) => any;
export declare const isElementPresentOnShadowRoot: (input: HTMLInputElement, controller: FormGroup<import("./form.tokens").FormInputOptions>) => number;
