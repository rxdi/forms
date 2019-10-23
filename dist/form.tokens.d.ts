export declare type FormStrategies = keyof WindowEventMap;
export interface FormOptions {
    name: string;
    strategy?: FormStrategies;
    multi?: boolean;
    strict?: boolean;
}
export interface FormInputOptions {
    [key: string]: [string, Function[]];
}
export interface InputErrorMessage<T = any> {
    key: T;
    message: string;
}
export interface ErrorObject {
    element: HTMLInputElement;
    errors: InputErrorMessage[];
}
export interface AbstractInput extends HTMLInputElement {
    valid?: boolean;
    invalid?: boolean;
    dirty?: boolean;
    touched?: boolean;
}
export declare const InputValidityState: {
    badInput: "badInput";
    customError: "customError";
    patternMismatch: "patternMismatch";
    rangeOverflow: "rangeOverflow";
    rangeUnderflow: "rangeUnderflow";
    stepMismatch: "stepMismatch";
    tooLong: "tooLong";
    tooShort: "tooShort";
    typeMismatch: "typeMismatch";
    valid: "valid";
    valueMissing: "valueMissing";
};
export declare type InputValidityState = keyof typeof InputValidityState;
