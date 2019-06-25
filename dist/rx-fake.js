"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class $Subscription {
    constructor() {
        this.o = new Map();
    }
    unsubscribe() {
        [...this.o.values()].forEach(v => this.o.delete(v));
    }
}
exports.$Subscription = $Subscription;
class $Observable extends $Subscription {
    constructor(fn) {
        super();
        this.init = true;
        this.fn = fn;
    }
    subscribe(c) {
        this.o.set(c, c);
        if (typeof this.fn === 'function' && this.init) {
            this.fn(this);
            this.init = false;
        }
        return {
            unsubscribe: () => {
                this.o.delete(c);
            }
        };
    }
    complete() {
        this.unsubscribe();
    }
    next(s) {
        [...this.o.values()].forEach(f => f(s));
    }
}
exports.$Observable = $Observable;
class $BehaviorSubject extends $Observable {
    constructor(v) {
        if (typeof v === 'function') {
            super(v);
        }
        super(null);
        this.v = v;
    }
    next(s) {
        this.v = s;
        [...this.o.values()].forEach(f => f(s));
    }
    getValue() {
        return this.v;
    }
}
function behaviorOrFake() {
    try {
        return require('rxjs').BehaviorSubject;
    }
    catch (e) { }
    return BehaviorSubject;
}
function observableOrFake() {
    try {
        return require('rxjs').Observable;
    }
    catch (e) { }
    return $Observable;
}
function subscriptionOrFake() {
    try {
        return require('rxjs').Subscription;
    }
    catch (e) { }
    return $Subscription;
}
function noop() { }
exports.noop = noop;
function BehaviorSubject(init) {
    const BS = behaviorOrFake();
    return new BS(init);
}
exports.BehaviorSubject = BehaviorSubject;
;
function Observable(init) {
    const O = observableOrFake();
    return new O(init);
}
exports.Observable = Observable;
;
function Subscription(init) {
    const S = subscriptionOrFake();
    return new S(init);
}
exports.Subscription = Subscription;
;
