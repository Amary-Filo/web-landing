import { Component } from '@angular/core';
import { NgpRadioItem } from 'ng-primitives/radio';

@Component({
  selector: 'app-radio-item',
  hostDirectives: [
    {
      directive: NgpRadioItem,
      inputs: ['ngpRadioItemValue:value', 'ngpRadioItemDisabled:disabled'],
    },
  ],
  template: `<span class="item-title"><ng-content /></span>`,
  styles: `
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-weight: 600;
      background-color: transparent;
      cursor: pointer;
      outline: none;
    }

    .item-title {
      opacity: 0.5;
      transition: 0.3s ease-in-out;
    }

    :host[data-focus-visible] {
      outline: 2px solid rgba(var(--cl-main-rgb, #4d4d74), 0.6);
      outline-offset: 2px;
    }

    :host[data-checked] {
      background-color: #222233;
      cursor: default;
    }

    :host[data-checked] .item-title {
      opacity: 1;
    }

    // [ngpRadioIndicator] {}

    // :host[data-hover] {
    //   background-color: var(--ngp-background-hover);
    // }

    // :host[data-press] {
    //   background-color: var(--ngp-background-active);
    // }

    // :host[data-checked] {
    //   background-color: var(--ngp-background-inverse);
    // }
  `,
})
export class RadioItemComponent {}
