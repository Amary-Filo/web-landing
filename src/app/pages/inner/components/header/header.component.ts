import {
  Component,
  computed,
  HostListener,
  signal,
  OnInit,
  OnDestroy,
  ElementRef,
  inject,
} from '@angular/core';
import { NgpDialogManager } from 'ng-primitives/dialog';

import { ScrollService } from '@services/scroll.service';
import { TalkDialog } from '@dialogs/talk/talk-dialog.component';

import { IconName } from '@components/icon/types';
import { UIIconComponent } from '@components/icon/icon.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'inner-header',
  standalone: true,
  imports: [UIIconComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderInnerComponent implements OnInit, OnDestroy {
  private dialogManager = inject(NgpDialogManager);
  private host = inject(ElementRef<HTMLElement>);
  private scroll = inject(ScrollService);

  private static readonly MOBILE_BP = 769;
  private observer?: IntersectionObserver;

  readonly menuOpen = signal(false);
  readonly isDesktop = signal(
    typeof window !== 'undefined' ? window.innerWidth >= HeaderInnerComponent.MOBILE_BP : true,
  );
  readonly icon = computed<IconName>(() => (this.menuOpen() ? 'closeLine' : 'menuFill'));

  readonly navItems = [
    // { id: 'hero', label: 'Home' },
    { link: '/', label: 'Main landing' },
    // { link: '/#showcases', label: 'Showcases' },
  ];

  readonly activeSection = signal<string>('hero');

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const rect = this.host.nativeElement.getBoundingClientRect();
      this.scroll.setHeaderOffset(rect.height);
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  toggleMenu() {
    if (!this.isDesktop()) this.menuOpen.update((v) => !v);
  }

  onNavItemClick() {
    if (!this.isDesktop()) this.menuOpen.set(false);
  }

  @HostListener('window:resize')
  onResize() {
    if (typeof window === 'undefined') return;

    const becameDesktop = window.innerWidth >= HeaderInnerComponent.MOBILE_BP;
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
