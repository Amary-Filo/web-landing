import { Directive, Input, TemplateRef } from "@angular/core";

@Directive({
  selector: "ngp-tab",
  standalone: true,
})
export class NgpTabDirective {
  @Input() id?: string;
  @Input({ required: true }) label!: string;
  @Input() badge?: string;
  @Input() icon?: string;
  @Input() disabled = false;

  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}

