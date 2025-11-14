import {
  Component,
  computed,
  HostListener,
  signal,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  inject,
} from '@angular/core';
import { NgpDialogManager } from 'ng-primitives/dialog';

import { ScrollService } from '@services/scroll.service';
import { TalkDialog } from '@dialogs/talk/talk-dialog.component';

import { IconName } from '@components/icon/types';
import { UIIconComponent } from '@components/icon/icon.component';

@Component({
  selector: 'main-header',
  standalone: true,
  imports: [UIIconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderMainComponent implements OnInit, AfterViewInit, OnDestroy {
  private dialogManager = inject(NgpDialogManager);
  private host = inject(ElementRef<HTMLElement>);
  private scroll = inject(ScrollService);

  private static readonly MOBILE_BP = 769;
  private observer?: IntersectionObserver;

  readonly menuOpen = signal(false);
  readonly isDesktop = signal(
    typeof window !== 'undefined' ? window.innerWidth >= HeaderMainComponent.MOBILE_BP : true
  );
  readonly icon = computed<IconName>(() => (this.menuOpen() ? 'closeLine' : 'menuFill'));

  readonly navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'solutions', label: 'Showcase' },
    { id: 'about', label: 'About' },
    { id: 'brief', label: 'Price' },
    { id: 'faq', label: 'FAQ' },
  ];

  readonly activeSection = signal<string>('hero');

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const rect = this.host.nativeElement.getBoundingClientRect();
      this.scroll.setHeaderOffset(rect.height);
    }
  }

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;

    const options: IntersectionObserverInit = { root: null, threshold: 0.4 };

    this.observer = new IntersectionObserver((entries) => {
      let best: { id: string; ratio: number } | null = null;

      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const id = (entry.target as HTMLElement).id;
        if (!id) continue;
        if (!best || entry.intersectionRatio > best.ratio) {
          best = { id, ratio: entry.intersectionRatio };
        }
      }

      if (best) this.activeSection.set(best.id);
    }, options);

    for (const item of this.navItems) {
      const el = document.getElementById(item.id);
      if (el) this.observer.observe(el);
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  toggleMenu() {
    if (!this.isDesktop()) this.menuOpen.update((v) => !v);
  }

  onNavItemClick(id: string) {
    this.scroll.scrollTo(id);
    this.activeSection.set(id);
    if (!this.isDesktop()) this.menuOpen.set(false);
  }

  @HostListener('window:resize')
  onResize() {
    if (typeof window === 'undefined') return;

    const becameDesktop = window.innerWidth >= HeaderMainComponent.MOBILE_BP;
    const wasDesktop = this.isDesktop();
    this.isDesktop.set(becameDesktop);

    if (becameDesktop && !wasDesktop) this.menuOpen.set(false);

    const rect = this.host.nativeElement.getBoundingClientRect();
    this.scroll.setHeaderOffset(rect.height);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isDesktop() || !this.menuOpen()) return;

    const target = event.target as HTMLElement | null;
    if (!target) return;

    const clickedInside = this.host.nativeElement.contains(target);
    if (!clickedInside) this.menuOpen.set(false);
  }

  openDialog() {
    this.dialogManager.open(TalkDialog);
  }
}
