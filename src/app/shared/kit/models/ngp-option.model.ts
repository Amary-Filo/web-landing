export interface NgpOption<T = any> {
  label: string;
  value: T;
  description?: string;
  hint?: string;
  icon?: string;
  disabled?: boolean;
  meta?: unknown;
}

export interface NgpOptionGroup<T = any> {
  label: string;
  options: NgpOption<T>[];
  description?: string;
}
