export declare class FormController<T = {
    [key: string]: string;
}> {
    private readonly _valueChanges;
    private form;
    readonly valueChanges: import("rxjs").Observable<T>;
    value: T;
    unsubscribe(): void;
    getValue(name: keyof T): T[keyof T];
    setValue(name: string, value: any): T;
    setFormValue(value: T): void;
    setFormElement(form: HTMLFormElement): void;
    getFormElement(): HTMLFormElement;
}
