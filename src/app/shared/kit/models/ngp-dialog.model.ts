import { Type } from "@angular/core";

export type NgpDialogAnimation = "fade" | "scale" | "slide-up";

export interface NgpDialogButton {
  label: string;
  action: "close" | "custom";
  appearance?: "primary" | "neutral" | "danger" | "link";
  value?: unknown;
  disabled?: boolean;
}

export interface NgpDialogConfig<TData = unknown> {
  heading?: string;
  subheading?: string;
  animation?: NgpDialogAnimation;
  closeButton?: boolean;
  width?: string;
  minHeight?: string;
  data?: TData;
  backdropClosable?: boolean;
  buttons?: NgpDialogButton[];
  contentComponent?: Type<unknown>;
}

