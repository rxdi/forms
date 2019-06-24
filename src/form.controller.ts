import { BehaviorSubject } from 'rxjs';

export class FormController<T = { [key: string]: string }> {
  private readonly _valueChanges: BehaviorSubject<T> = new BehaviorSubject(
    {} as any
  );

  private form: HTMLFormElement;

  get valueChanges() {
    return this._valueChanges.asObservable();
  }

  get value() {
    return this._valueChanges.getValue();
  }

  set value(value: T) {
    this._valueChanges.next(value);
  }

  unsubscribe() {
    this._valueChanges.unsubscribe();
  }

  getValue(name: keyof T): T[keyof T] {
    return this.value[name];
  }

  setValue(name: string, value: any) {
    const values = this.value;
    values[name] = value;
    this.value = values;
    return values;
  }

  setFormValue(value: T) {
    this.value = value;
  }

  setFormElement(form: HTMLFormElement) {
    this.form = form;
  }

  getFormElement() {
    return this.form;
  }
}
