import { NGP_COUNTRY_TIMEZONE_GROUPS } from './countries-timezones';

export const COUNTRIES_LIST: {
  key: string;
  value: string;
  flag: string;
}[] = NGP_COUNTRY_TIMEZONE_GROUPS.flatMap((group) =>
  group.countries.map((c) => ({
    key: c.code,
    value: c.name,
    flag: `https://flagcdn.com/${c.code.toLowerCase()}.svg`,
  })),
).sort((a, b) => a.value.localeCompare(b.value, 'en'));
