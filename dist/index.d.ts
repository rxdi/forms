import { Observable } from 'rxjs';
export declare class FormGroupController<T = {
    [key: string]: string;
}> {
    private readonly _valueChanges;
    readonly valueChanges: Observable<T>;
    values: T;
    unsubscribe(): void;
    getValue(name: string): keyof T;
    setValue(name: string, value: any): T;
}
export declare type FormStrategies = 'change' | 'input' | 'none';
export interface FormOptions {
    name: string;
    strategy?: FormStrategies;
}
export declare function Form(options?: FormOptions): (protoOrDescriptor: Object, name?: string | number | symbol) => void;
export declare class FormGroup<T = {
    [key: string]: string;
}> {
    values: T;
    name?: string;
    valueChanges: Observable<T>;
    constructor(values: T);
    getValue(name: string): keyof T;
    setValue(name: string, value: any): void;
}
