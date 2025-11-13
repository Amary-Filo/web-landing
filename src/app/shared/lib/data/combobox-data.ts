import { NGP_COUNTRY_TIMEZONE_GROUPS, NGP_TIMEZONE_GROUPS } from './countries-timezones';

export interface NgpOption<T = any> {
  label: string;
  value: T;
  hint?: string;
  icon?: string;
  disabled?: boolean;
  meta?: any;
}

export interface NgpOptionGroup<T = any> {
  label: string;
  options: NgpOption<T>[];
}

export function flagEmoji(iso2: string): string {
  const A = 0x1f1e6;
  return iso2.toUpperCase().replace(/./g, (c) => String.fromCodePoint(A + (c.charCodeAt(0) - 65)));
}

export const flagCdn = (code: string, size: 24 | 48 = 24) =>
  `https://flagcdn.com/w${size}/${code.toLowerCase()}.png`;

export interface NgpCountryTimeZone {
  code: string;
  name: string;
  continent: string;
  timezones: string[];
  primaryTimezone: string;
}

export function buildCountryGroups(useEmoji = true): NgpOptionGroup<string>[] {
  return NGP_COUNTRY_TIMEZONE_GROUPS.map((g) => ({
    label: g.continent,
    options: g.countries
      .map((c) => ({
        label: c.name,
        value: c.code,
        hint: c.primaryTimezone,
        icon: useEmoji ? flagEmoji(c.code) : flagCdn(c.code),
        meta: {
          code: c.code.toLowerCase(),
          name: c.name.toLowerCase(),
          tz: (c.primaryTimezone ?? '').toLowerCase(),
          search: `${c.code} ${c.name} ${c.primaryTimezone ?? ''}`.toLowerCase(),
        },
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  }));
}

export function buildTimezoneGroups(): NgpOptionGroup<string>[] {
  return NGP_TIMEZONE_GROUPS.map((g) => ({
    label: g.label,
    options: g.options.map((o) => ({
      ...o,
      meta: {
        ...(o.meta ?? {}),
        search: `${o.label} ${o.value} ${o.hint ?? ''}`.toLowerCase(),
      },
    })),
  }));
}

export interface NgpOption<T = any> {
  label: string;
  value: T;
  hint?: string;
  icon?: string;
  disabled?: boolean;
  meta?: any;
}

export interface NgpOptionGroup<T = any> {
  label: string;
  options: NgpOption<T>[];
}

export const isUrl = (s?: string) => !!s && /^(https?:)?\/\//.test(s);

export type TCountry = {
  key: string;
  value: string;
  flag: string;
};

export const COUNTRIES_LIST: TCountry[] = NGP_COUNTRY_TIMEZONE_GROUPS.flatMap((group) =>
  group.countries.map((c) => ({
    key: c.code,
    value: c.name,
    flag: `https://flagcdn.com/${c.code.toLowerCase()}.svg`,
  }))
).sort((a, b) => a.value.localeCompare(b.value, 'en'));
