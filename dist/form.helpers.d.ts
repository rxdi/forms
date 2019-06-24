import { FormController } from './form.controller';
import { LitElement } from '@rxdi/lit-html';
export declare const updateValueAndValidity: (method: Function, controller: FormController<{
    [key: string]: string;
}>, element: LitElement) => (event: {
    target: HTMLInputElement;
}) => any;
export declare const isElementPresentOnShadowRoot: (input: HTMLInputElement, controller: FormController<{
    [key: string]: string;
}>) => number;
