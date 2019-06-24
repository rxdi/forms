export declare type FormStrategies = keyof WindowEventMap;
export interface FormOptions {
    name: string;
    strategy?: FormStrategies;
    multi?: boolean;
}
export interface FormInputOptions {
    [key: string]: [string, Function[]];
}
