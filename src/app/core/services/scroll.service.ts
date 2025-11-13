import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private headerOffset = signal(80);

  setHeaderOffset(px: number) {
    this.headerOffset.set(px);
  }

  scrollTo(id: string, behavior: ScrollBehavior = 'smooth') {
    if (typeof window === 'undefined') return;

    const el = document.getElementById(id);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const offset = this.headerOffset();

    const top = rect.top + scrollTop - offset - 16;

    window.scrollTo({ top, behavior });
  }
}
