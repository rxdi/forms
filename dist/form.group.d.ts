import { Observable } from 'rxjs';
export declare class FormGroup<T = {
    [key: string]: string;
}> {
    name?: string;
    valueChanges: Observable<T>;
    value: T;
    constructor(value: T);
    getValue(name: keyof T): keyof T;
    setValue(name: keyof T, payload: any): T[keyof T];
}
