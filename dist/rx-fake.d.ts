export declare class $Subscription<T> {
    o: Map<Function, (a: T) => void>;
    unsubscribe(): void;
}
declare type FN<T> = (o: $Observable<T>) => void | Function;
export declare class $Observable<T> extends $Subscription<T> {
    fn: FN<T>;
    init: boolean;
    constructor(fn?: FN<T>);
    subscribe(c: (a: T) => void): $Subscription<T>;
    complete(): void;
    next(s: T): void;
}
declare class $BehaviorSubject<T> extends $Observable<T> {
    v: T;
    constructor(v: T);
    next(s: T): void;
    getValue(): T;
}
export declare function noop(): void;
export declare function BehaviorSubject<T>(init: T): void;
export declare function Observable<T>(init: T): void;
export declare function Subscription<T>(init: T): void;
export interface BehaviorSubject<T> extends $BehaviorSubject<T> {
}
export interface Observable<T> extends $Observable<T> {
}
export interface Subscription<T> extends $Subscription<T> {
}
export {};
