import { Observable } from 'rxjs';
import { FormInputOptions } from './form.tokens';
export declare class FormGroup<T = FormInputOptions> {
    name?: string;
    valueChanges: Observable<T>;
    value: T;
    valid: boolean;
    invalid: boolean;
    errors: T;
    constructor(value: T);
    getValue(name: keyof T): keyof T;
    setValue(name: keyof T, payload: any): T[keyof T];
}
