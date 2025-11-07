import { Directive, TemplateRef, booleanAttribute, input } from '@angular/core';

@Directive({
  selector: 'ngp-tab',
  standalone: true,
})
export class NgpTabDirective {
  readonly id = input<string | undefined>(undefined);
  readonly value = input<string | undefined>(undefined);
  readonly label = input.required<string>();
  readonly badge = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });

  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
