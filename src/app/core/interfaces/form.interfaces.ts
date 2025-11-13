import { FormControl, FormGroup } from '@angular/forms';
import { TTiers } from 'src/app/pages/main/components';

export type TMetaGeo = {
  timezone: string;
  timezoneOffset: number;
  timezoneGMT: string;
  region: string;
  currentDateTime: string;
};

export type TMetaGeoControls = {
  [K in keyof TMetaGeo]: FormControl<TMetaGeo[K]>;
};

export type TMetaBrowser = {
  browserLanguage: string;
  browserLanguages: string;
  userAgent: string;
  browserName: string;
  browserVersion: string;
};

export type TMetaBrowserControls = {
  [K in keyof TMetaBrowser]: FormControl<TMetaBrowser[K]>;
};

export type TMetaDevice = {
  osName: string;
  osVersion: string;
  deviceType: string;
  isMobile: boolean;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
};

export type TMetaDeviceControls = {
  [K in keyof TMetaDevice]: FormControl<TMetaDevice[K]>;
};

export type TMetaNavigation = {
  referrerUrl: string;
  currentUrl: string;
  pageTitle: string;
};

export type TMetaNavigationControls = {
  [K in keyof TMetaNavigation]: FormControl<TMetaNavigation[K]>;
};

export type TMetaUtm = {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
};

export type TMetaUtmControls = {
  [K in keyof TMetaUtm]: FormControl<TMetaUtm[K]>;
};

export type TMetaValue = TMetaGeo & TMetaBrowser & TMetaDevice & TMetaNavigation & TMetaUtm;

export type TMetaControls = {
  geo: FormGroup<TMetaGeoControls>;
  browser: FormGroup<TMetaBrowserControls>;
  device: FormGroup<TMetaDeviceControls>;
  navigation: FormGroup<TMetaNavigationControls>;
  utm: FormGroup<TMetaUtmControls>;
};

export type TContactType = 'telegram' | 'email';
export type TFormType = 'brief' | 'question';

export interface TFormData {
  type: FormControl<TFormType>;
  meta: FormGroup<TMetaControls>;
}

export interface BaseFormControls extends TFormData {
  name: FormControl<string>;
  contact: FormControl<string>;
  message: FormControl<string | null>;
}

export interface OrderFormControls extends BaseFormControls {
  formatContact: FormControl<TContactType>;
  country: FormControl<{
    key: string;
    value: string;
    flag: string;
  } | null>;
  tier: FormControl<TTiers>;
  price: FormControl<string>;
  estimate: FormControl<string>;
}
