import { Component } from '@angular/core';
import { NgpTextarea } from 'ng-primitives/textarea';

@Component({
  selector: 'textarea[app-textarea]',
  hostDirectives: [{ directive: NgpTextarea, inputs: ['disabled'] }],
  template: ` <ng-content /> `,
  styles: `
    :host {
      max-width: var(--kit-input-max-width);
      width: 100%;

      padding: 10px 10px 10px 20px;

      border-radius: var(--radius-lg, 10px);
      border: none;
      background-color: #222233;
      box-sizing: border-box;
      color: white;

      outline: 2px solid transparent;
      outline-offset: 2px;
      transition: 0.3s ease-in-out;
    }

    :host[data-focus] {
      outline-color: rgba(var(--cl-main-rgb, #4d4d74), 0.6);
    }

    :host::placeholder {
      font-weight: 600;
      font-size: 14px;
      color: #808095;
    }

    :host.ng-invalid.ng-touched {
      outline-color: #ff4d4f;
    }
  `,
})
export class TextareaComponent {}
