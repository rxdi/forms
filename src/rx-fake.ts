



export class $Subscription<T> {
  o: Map<Function, (a: T) => void> = new Map();

  unsubscribe() {
    [...this.o.values()].forEach(v => this.o.delete(v));
  }
}

type FN<T> = (o: $Observable<T>) => void | Function;

export class $Observable<T> extends $Subscription<T> {
  fn: FN<T>;
  init: boolean = true;
  constructor(fn?: FN<T>) {
    super();
    this.fn = fn;
  }

  subscribe(c: (a: T) => void) {
    this.o.set(c, c);
    if (typeof this.fn === 'function' && this.init) {
      this.fn(this);
      this.init = false;
    }
    return <$Subscription<T>>{
      unsubscribe: () => {
        this.o.delete(c);
      }
    };
  }

  complete() {
    this.unsubscribe();
  }

  next(s: T) {
    [...this.o.values()].forEach(f => f(s));
  }
}

class $BehaviorSubject<T> extends $Observable<T> {
  v: T;
  constructor(v: T) {
    if (typeof v === 'function') {
      super(v as any);
    }
    super(null);
    this.v = v;
  }

  next(s: T) {
    this.v = s;
    [...this.o.values()].forEach(f => f(s));
  }

  getValue() {
    return this.v;
  }
}

function behaviorOrFake<T>(): void {
    try {
        return require('rxjs').BehaviorSubject;
    } catch (e) {}
    return BehaviorSubject as any;
}

function observableOrFake<T>(): void {
    try {
        return require('rxjs').Observable;
    } catch (e) {}
    return $Observable as any;
}

function subscriptionOrFake<T>(): void {
    try {
        return require('rxjs').Subscription;
    } catch (e) {}
    return $Subscription as any;
}

export function noop() {}

export function BehaviorSubject<T>(init: T): void {
    const BS: any = behaviorOrFake();
    return new BS(init);
};

export function Observable<T>(init: T): void {
    const O: any = observableOrFake();
    return new O(init);
};

export function Subscription<T>(init: T): void {
    const S: any = subscriptionOrFake();
    return new S(init);
};

export interface BehaviorSubject<T> extends $BehaviorSubject<T> {}
export interface Observable<T> extends $Observable<T> {}
export interface Subscription<T> extends $Subscription<T> {}