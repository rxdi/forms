# Reactive forms binding for LitHtml

#### Install
```bash
npm i @rxdi/forms
```



#### Using it inside component

##### Important!

> Define `<form>` element with `name` `<form name"my-form"></form>`

> Put `my-form` inside @Form({ name: 'my-form' }) decorator since this will be our form selector


```typescript
import { html, Component } from '@rxdi/lit-html';
import { FormGroup, Form } from '@rxdi/forms';
import { BaseComponent } from '../shared/base.component';

/**
 * @customElement login-component
 */
@Component({
  selector: 'login-component',
  template(this: LoginComponent) {
    return html`
      <form name="my-form" @submit=${this.onSubmit}>
        <input
          style="margin-bottom: 20px;"
          name="email"
          type="email"
          placeholder="Email address"
          required
          autofocus
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required=""
        />
        <div>
          <label>
            <input name="rememberMe" type="checkbox" /> Remember me
          </label>
        </div>
        <button type="submit">
          Sign in
        </button>
      </form>
    `;
  }
})
export class LoginComponent extends BaseComponent {
  @Form({
    strategy: 'change',
    name: 'my-form'
  })
  private form = new FormGroup({
    password: '',
    email: '',
    rememberMe: ''
  });

  OnInit() {
    this.form.valueChanges.subscribe(data => {
      data; // password, email, rememberMe
      debugger;
    });
    this.form.getValue('password');
    this.form.setValue('email', 'blabla');
  }

  onSubmit(event: Event) {
    this.form.values;
  }
}


```
