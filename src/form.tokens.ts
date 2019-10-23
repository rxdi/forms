export type FormStrategies = keyof WindowEventMap;
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

function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}

export const InputValidityState = strEnum([
  'badInput',
  'customError',
  'patternMismatch',
  'rangeOverflow',
  'rangeUnderflow',
  'stepMismatch',
  'tooLong',
  'tooShort',
  'typeMismatch',
  'valid',
  'valueMissing'
]);
export type InputValidityState = keyof typeof InputValidityState;
