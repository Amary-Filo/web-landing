import { Injectable } from "@angular/core";
import {
  NGP_COUNTRY_TIMEZONE_GROUPS,
  NGP_TIMEZONE_GROUPS,
  NgpCountryTimeZone,
} from "./countries-timezones";
import { NgpOption, NgpOptionGroup } from "../models/ngp-option.model";

@Injectable({
  providedIn: "root",
})
export class NgpKitDataService {
  getCountryTimezoneGroups() {
    return NGP_COUNTRY_TIMEZONE_GROUPS;
  }

  getTimezoneGroups(): NgpOptionGroup<string>[] {
    return NGP_TIMEZONE_GROUPS;
  }

  getCountryOptions(): NgpOptionGroup<string>[] {
    return NGP_COUNTRY_TIMEZONE_GROUPS.map((group) => ({
      label: group.continent,
      options: group.countries.map((country) => this.mapCountryToOption(country)),
    }));
  }

  getCountryOptionsFlat(): NgpOption<string>[] {
    return NGP_COUNTRY_TIMEZONE_GROUPS.flatMap((group) =>
      group.countries.map((country) => this.mapCountryToOption(country)),
    );
  }

  private mapCountryToOption(country: NgpCountryTimeZone): NgpOption<string> {
    const primary = country.primaryTimezone.replace(/_/g, " ");
    const hint = `${country.code} · ${primary}`;
    return {
      label: country.name,
      value: country.code,
      hint,
      meta: country,
    };
  }
}

