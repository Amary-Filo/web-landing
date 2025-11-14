import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

type CountryValue = string | null | undefined | { value?: string };

@Injectable({ providedIn: 'root' })
export class ContactRequestService {
  private http = inject(HttpClient);
  private endpoint = environment.contactApiUrl;

  submitBrief<T = unknown>(payload: Record<string, any>): Observable<T> {
    const normalized = {
      ...payload,
      country: this.unwrapCountry(payload['country']),
    };

    return this.post<T>(normalized);
  }

  submitQuestion<T = unknown>(payload: Record<string, any>): Observable<T> {
    return this.post<T>(payload);
  }

  private post<T>(body: Record<string, any>): Observable<T> {
    if (!this.endpoint) {
      return throwError(() => new Error('Contact endpoint is not configured'));
    }

    return this.http.post<T>(this.endpoint, body).pipe(
      retry({
        count: 2,
        delay: (_, retryCount) => timer(retryCount * 300),
      }),
      catchError((error) => {
        console.error('Contact submission failed', error);
        return throwError(() => error);
      })
    );
  }

  private unwrapCountry(country: CountryValue): string | null {
    if (!country) return null;
    if (typeof country === 'string') return country;
    if (typeof country === 'object' && typeof country.value === 'string') {
      return country.value;
    }

    return null;
  }
}
