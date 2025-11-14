import { NGP_COUNTRY_TIMEZONE_GROUPS } from './countries-timezones';

// const flagEmoji = (iso2: string): string =>
//   iso2.toUpperCase().replace(/./g, (c) => String.fromCodePoint(0x1f1e6 + (c.charCodeAt(0) - 65)));
// const flagCdn = (code: string, size: 24 | 48 = 24) =>
//   `https://flagcdn.com/w${size}/${code.toLowerCase()}.png`;

export const COUNTRIES_LIST: {
  key: string;
  value: string;
  flag: string;
}[] = NGP_COUNTRY_TIMEZONE_GROUPS.flatMap((group) =>
  group.countries.map((c) => ({
    key: c.code,
    value: c.name,
    flag: `https://flagcdn.com/${c.code.toLowerCase()}.svg`,
  }))
).sort((a, b) => a.value.localeCompare(b.value, 'en'));
