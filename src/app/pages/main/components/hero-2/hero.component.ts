import {
  afterNextRender,
  Component,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { ScrollService } from '@services/scroll.service';

@Component({
  selector: 'section-hero-2',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class Hero2SectionComponent {
  private scroll = inject(ScrollService);
  // readonly rotate = signal<number>(50);

  // private destroyRef = inject(DestroyRef);
  // private document = inject(DOCUMENT);

  // @ViewChild('gradientText') gradientTextRef!: ElementRef<HTMLElement>;

  // constructor() {
  //   // Выполняется только в браузере, когда DOM готов
  //   afterNextRender(() => {
  //     this.initInteraction();
  //   });
  // }

  // private initInteraction() {
  //   const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  //   if (isTouch) {
  //     this.initMobileOrientation();
  //   } else {
  //     this.initDesktopMouse();
  //   }
  // }

  // // --- ЛОГИКА ДЛЯ DESKTOP (Мышь) ---
  // private initDesktopMouse() {
  //   let ticking = false; // Флаг для requestAnimationFrame

  //   const onMouseMove = (e: MouseEvent) => {
  //     if (!ticking) {
  //       window.requestAnimationFrame(() => {
  //         this.calculateAngle(e.clientX, e.clientY);
  //         ticking = false;
  //       });
  //       ticking = true;
  //     }
  //   };

  //   this.document.addEventListener('mousemove', onMouseMove);

  //   // Очистка слушателя при уничтожении компонента
  //   this.destroyRef.onDestroy(() => {
  //     this.document.removeEventListener('mousemove', onMouseMove);
  //   });
  // }

  // // --- ЛОГИКА ДЛЯ MOBILE (Гироскоп) ---
  // private initMobileOrientation() {
  //   // Проверяем поддержку API
  //   if (!window.DeviceOrientationEvent) return;

  //   let ticking = false;

  //   const onOrientation = (event: DeviceOrientationEvent) => {
  //     if (!ticking) {
  //       window.requestAnimationFrame(() => {
  //         // gamma - это наклон влево/вправо (обычно от -90 до 90)
  //         const tilt = event.gamma || 0;
  //         // Усиливаем эффект (* 2) и добавляем к базе
  //         this.rotate.set(50 + tilt * 2);
  //         ticking = false;
  //       });
  //       ticking = true;
  //     }
  //   };

  //   // В iOS 13+ доступ к датчикам требует разрешения, но если его нет —
  //   // событие просто не придет, и ничего не сломается (останется 50deg).
  //   window.addEventListener('deviceorientation', onOrientation);

  //   this.destroyRef.onDestroy(() => {
  //     window.removeEventListener('deviceorientation', onOrientation);
  //   });
  // }

  // // Математика вычисления угла
  // private calculateAngle(cursorX: number, cursorY: number) {
  //   if (!this.gradientTextRef) return;

  //   const rect = this.gradientTextRef.nativeElement.getBoundingClientRect();

  //   // Центр текста
  //   const centerX = rect.left + rect.width / 2;
  //   const centerY = rect.top + rect.height / 2;

  //   // Вычисляем угол в радианах
  //   const radians = Math.atan2(cursorY - centerY, cursorX - centerX);

  //   // Переводим в градусы. +90 смещает начало отсчета для красоты CSS градиента
  //   const degrees = radians * (180 / Math.PI) + 90;

  //   this.rotate.set(Math.round(degrees));
  // }

  goTo(id: string) {
    this.scroll.scrollTo(id);
  }
}
