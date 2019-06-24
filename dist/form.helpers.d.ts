import { FormController } from './form.controller';
import { LitElement } from '@rxdi/lit-html';
export declare const updateValueAndValidity: (method: Function, controller: FormController<import("./form.tokens").FormInputOptions>, parentElement: LitElement) => (event: {
    target: HTMLInputElement;
}) => any;
export declare const isElementPresentOnShadowRoot: (input: HTMLInputElement, controller: FormController<import("./form.tokens").FormInputOptions>) => number;
