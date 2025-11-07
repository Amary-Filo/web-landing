import { NGP_COUNTRY_TIMEZONE_GROUPS, NGP_TIMEZONE_GROUPS } from './countries-timezones';

// export interface NgpOption<T = any> {
//   label: string;
//   value: T;
//   description?: string;
//   hint?: string;
//   icon?: string;
//   disabled?: boolean;
//   meta?: unknown;
// }

// export interface NgpOptionGroup<T = any> {
//   label: string;
//   options: NgpOption<T>[];
//   description?: string;
// }

// combobox-data.ts
export interface NgpOption<T = any> {
  label: string;
  value: T;
  hint?: string;
  icon?: string; // emoji или url
  disabled?: boolean;
  meta?: any; // сюда кладём поля для поиска
}

export interface NgpOptionGroup<T = any> {
  label: string;
  options: NgpOption<T>[];
}

// emoji-флаг из ISO2
export function flagEmoji(iso2: string): string {
  const A = 0x1f1e6;
  return iso2.toUpperCase().replace(/./g, (c) => String.fromCodePoint(A + (c.charCodeAt(0) - 65)));
}

// CDN-изображение флага (если захочешь картинки)
export const flagCdn = (code: string, size: 24 | 48 = 24) =>
  `https://flagcdn.com/w${size}/${code.toLowerCase()}.png`;

// ===== твои данные =====
export interface NgpCountryTimeZone {
  code: string;
  name: string;
  continent: string;
  timezones: string[];
  primaryTimezone: string;
}

// ===== билдеры =====
export function buildCountryGroups(useEmoji = true): NgpOptionGroup<string>[] {
  return NGP_COUNTRY_TIMEZONE_GROUPS.map((g) => ({
    label: g.continent,
    options: g.countries
      .map((c) => ({
        label: c.name,
        value: c.code, // key/value режим — ISO2
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
  // дополним meta.search, остальное у тебя уже готово
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

// combobox.types.ts
export interface NgpOption<T = any> {
  label: string;
  value: T;
  hint?: string;
  icon?: string; // emoji или URL
  disabled?: boolean;
  meta?: any; // сюда кладём поля для поиска
}

export interface NgpOptionGroup<T = any> {
  label: string; // например, "Europe"
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
