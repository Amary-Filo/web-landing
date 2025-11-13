import { inject, Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UAParser } from 'ua-parser-js';
import { DeviceDetectorService } from 'ngx-device-detector';
import {
  TMetaBrowserControls,
  TMetaControls,
  TMetaDeviceControls,
  TMetaGeoControls,
  TMetaNavigationControls,
  TMetaUtmControls,
} from '../interfaces/form.interfaces';

export interface CollectedMetaData {
  timezone: string;
  timezoneOffset: number;
  timezoneGMT: string;
  region: string;
  currentDateTime: string;

  browserLanguage: string;
  browserLanguages: string;
  userAgent: string;
  browserName: string;
  browserVersion: string;

  osName: string;
  osVersion: string;
  deviceType: string;
  isMobile: boolean;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;

  referrerUrl: string;
  currentUrl: string;
  pageTitle: string;

  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
}

interface TimezoneData {
  timezone: string;
  timezoneOffset: number;
  timezoneGMT: string;
  region: string;
  currentDateTime: string;
}

interface UTMParams {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
}

@Injectable({ providedIn: 'root' })
export class DataCollectorService {
  private deviceService = inject(DeviceDetectorService);
  private parser = new UAParser();
  private cachedData?: CollectedMetaData;

  collectMetaData(): CollectedMetaData {
    if (this.cachedData) return this.cachedData;

    const uaResult = this.parser.getResult();
    const timezoneData = this.getTimezoneData();
    const utmParams = this.getUTMParams();

    this.cachedData = {
      timezone: timezoneData.timezone,
      timezoneOffset: timezoneData.timezoneOffset,
      timezoneGMT: timezoneData.timezoneGMT,
      region: timezoneData.region,
      currentDateTime: timezoneData.currentDateTime,

      browserLanguage: navigator.language || 'unknown',
      browserLanguages: JSON.stringify(Array.from(navigator.languages || [navigator.language])),
      userAgent: navigator.userAgent,
      browserName: uaResult.browser.name || 'Unknown',
      browserVersion: uaResult.browser.version || 'Unknown',

      osName: uaResult.os.name || 'Unknown',
      osVersion: uaResult.os.version || 'Unknown',
      deviceType: uaResult.device.type || 'desktop',
      isMobile: this.deviceService.isMobile(),
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,

      referrerUrl: document.referrer || 'direct',
      currentUrl: window.location.href,
      pageTitle: document.title,

      utmSource: utmParams.utmSource,
      utmMedium: utmParams.utmMedium,
      utmCampaign: utmParams.utmCampaign,
      utmContent: utmParams.utmContent,
      utmTerm: utmParams.utmTerm,
    };

    return this.cachedData;
  }

  getMetaFormGroup(): FormGroup<TMetaControls> {
    const data = this.collectMetaData();

    return new FormGroup<TMetaControls>({
      geo: new FormGroup<TMetaGeoControls>({
        timezone: new FormControl(data.timezone, { nonNullable: true }),
        timezoneOffset: new FormControl(data.timezoneOffset, { nonNullable: true }),
        timezoneGMT: new FormControl(data.timezoneGMT, { nonNullable: true }),
        region: new FormControl(data.region, { nonNullable: true }),
        currentDateTime: new FormControl(data.currentDateTime, { nonNullable: true }),
      }),

      browser: new FormGroup<TMetaBrowserControls>({
        browserLanguage: new FormControl(data.browserLanguage, { nonNullable: true }),
        browserLanguages: new FormControl(data.browserLanguages, { nonNullable: true }),
        userAgent: new FormControl(data.userAgent, { nonNullable: true }),
        browserName: new FormControl(data.browserName, { nonNullable: true }),
        browserVersion: new FormControl(data.browserVersion, { nonNullable: true }),
      }),

      device: new FormGroup<TMetaDeviceControls>({
        osName: new FormControl(data.osName, { nonNullable: true }),
        osVersion: new FormControl(data.osVersion, { nonNullable: true }),
        deviceType: new FormControl(data.deviceType, { nonNullable: true }),
        isMobile: new FormControl(data.isMobile, { nonNullable: true }),
        screenWidth: new FormControl(data.screenWidth, { nonNullable: true }),
        screenHeight: new FormControl(data.screenHeight, { nonNullable: true }),
        devicePixelRatio: new FormControl(data.devicePixelRatio, { nonNullable: true }),
      }),

      navigation: new FormGroup<TMetaNavigationControls>({
        referrerUrl: new FormControl(data.referrerUrl, { nonNullable: true }),
        currentUrl: new FormControl(data.currentUrl, { nonNullable: true }),
        pageTitle: new FormControl(data.pageTitle, { nonNullable: true }),
      }),

      utm: new FormGroup<TMetaUtmControls>({
        utmSource: new FormControl(data.utmSource),
        utmMedium: new FormControl(data.utmMedium),
        utmCampaign: new FormControl(data.utmCampaign),
        utmContent: new FormControl(data.utmContent),
        utmTerm: new FormControl(data.utmTerm),
      }),
    });
  }

  private getTimezoneData(): TimezoneData {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
    const now = new Date();
    const offset = -now.getTimezoneOffset();
    const hours = Math.floor(offset / 60);
    const minutes = Math.abs(offset % 60);
    const sign = hours >= 0 ? '+' : '-';
    const timezoneGMT =
      `GMT${sign}${Math.abs(hours)}${minutes ? ':' + minutes.toString().padStart(2, '0') : ''}` ||
      'GMT+0';
    const region = timezone.split('/')[0] || 'Unknown';

    return {
      timezone,
      timezoneOffset: offset || 0,
      timezoneGMT,
      region,
      currentDateTime: now.toISOString() || new Date().toISOString(),
    };
  }

  private getUTMParams(): UTMParams {
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get('utm_source') || null,
      utmMedium: params.get('utm_medium') || null,
      utmCampaign: params.get('utm_campaign') || null,
      utmContent: params.get('utm_content') || null,
      utmTerm: params.get('utm_term') || null,
    };
  }

  // debugLog(): void {
  //   const data = this.collectMetaData();
  //   console.table({
  //     Timezone: data.timezone,
  //     GMT: data.timezoneGMT,
  //     Region: data.region,
  //     Browser: `${data.browserName} ${data.browserVersion}`,
  //     OS: `${data.osName} ${data.osVersion}`,
  //     Device: `${data.deviceType} (Mobile: ${data.isMobile})`,
  //     Screen: `${data.screenWidth}x${data.screenHeight}`,
  //     Language: data.browserLanguage,
  //     Referrer: data.referrerUrl,
  //     'UTM Source': data.utmSource || 'none',
  //   });
  // }
}
