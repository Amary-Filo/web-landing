import { Component } from '@angular/core';
import { NgpInput } from 'ng-primitives/input';

@Component({
  selector: 'input[app-input]',
  hostDirectives: [{ directive: NgpInput, inputs: ['disabled'] }],
  template: '',
  styles: `
    :host {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      max-width: var(--kit-input-max-width);
      width: 100%;

      padding: 10px 10px 10px 20px;
      line-height: 1.2;

      border-radius: 10px;
      border: none;

      background-color: #29293F;
      color: white;
      box-sizing: border-box;
      outline: 2px solid transparent;
      outline-offset: 2px;
      transition: .3s ease-in-out;
    }

    :host:focus {
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
export class InputComponent {}
