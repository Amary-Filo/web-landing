import { Component, computed, input } from '@angular/core';
import { UIIconComponent } from '@app/shared/components/icon/icon.component';

import { IProduct } from '../product.component';

@Component({
  selector: 'product-item',
  imports: [UIIconComponent],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
  standalone: true,
})
export class ProductItemComponent {
  readonly data = input.required<IProduct>();

  readonly itemColorClass = computed(() => {
    const color = this.data().color;
    return color ? `cl-g-${color}` : '';
  });

  readonly itemImgSrc = computed(() => {
    const imgName = this.data().img;
    return imgName ? `./assets/img/${imgName}` : null;
  });
}
