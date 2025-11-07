import { FormControl, FormGroup } from '@angular/forms';
import { TTiers } from 'src/app/pages/main/components';

// === GEO ===
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

// === BROWSER ===
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

// === DEVICE ===
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

// === NAVIGATION ===
export type TMetaNavigation = {
  referrerUrl: string;
  currentUrl: string;
  pageTitle: string;
};

export type TMetaNavigationControls = {
  [K in keyof TMetaNavigation]: FormControl<TMetaNavigation[K]>;
};

// === UTM ===
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

// === META (ВСЕ ГРУППЫ) ===
export type TMetaValue = TMetaGeo & TMetaBrowser & TMetaDevice & TMetaNavigation & TMetaUtm;

export type TMetaControls = {
  geo: FormGroup<TMetaGeoControls>;
  browser: FormGroup<TMetaBrowserControls>;
  device: FormGroup<TMetaDeviceControls>;
  navigation: FormGroup<TMetaNavigationControls>;
  utm: FormGroup<TMetaUtmControls>;
};

// Forms
export type TContactType = 'telegram' | 'email';

export type OrderFormValue = {
  name: string;
  type: TContactType;
  contact: string | null;
  text: string | null;
  country: string | null;
  tier: TTiers;
  price: string;
  estimate: string;
  meta: TMetaValue;
};

export type OrderFormControls = {
  name: FormControl<string>;
  type: FormControl<TContactType>;
  contact: FormControl<string | null>;
  text: FormControl<string | null>;
  country: FormControl<string | null>;
  tier: FormControl<TTiers>;
  price: FormControl<string>;
  estimate: FormControl<string>;
  meta: FormGroup<TMetaControls>;
};
