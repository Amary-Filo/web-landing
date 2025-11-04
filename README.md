# BusinessWebsite

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## NG Primitives Kit

Ниже описана новая библиотека `src/app/shared/kit`, которая предоставляет набор stand-alone компонентов и общую систему токенов для кастомизации. Все примеры приведены для Angular 20, но их можно адаптировать для любой версии с поддержкой standalone компонентов.

### Подключение токенов и тем

1. Глобальные токены подключаются из `kit.tokens.scss`. Файл уже импортирован в `src/styles.scss`:

   ```scss
   @use "./app/shared/kit/kit.tokens.scss";
   ```

2. В файле определены базовые переменные (`--ngp-*`) и преднастроенные темы:
   - `.ngp-theme-base` — стандартная тема.
   - `.ngp-theme-brand` — «брендовая» тема в холодных тонах.
   - `.ngp-theme-halloween` — пример тёплой темы.
   - `.ngp-theme-light`/`.theme-secondary` — светлая тема.

3. Любая тема может быть назначена на уровне `body` или на любом контейнере:

   ```html
   <body class="ngp-theme-halloween">…</body>
   <div class="card ngp-theme-brand">
     <ngp-select …></ngp-select>
   </div>
   ```

4. Для быстрых переопределений доступны mixin'ы:

   ```scss
   @use "./app/shared/kit/kit.tokens" as kit;

   @include kit.ngp-theme('.theme-halloween', (
     ngp-accent: #ff6b1a,
     ngp-surface-2: #2b1843,
     select-option-bg-selected: rgba(255, 149, 0, 0.3)
   ));
   ```

5. Токены можно задавать точечно на компонент:

   ```scss
   ngp-select.custom-select {
     --select-bg: linear-gradient(135deg, #1f2937, #111827);
     --select-border: rgba(148, 163, 184, 0.35);
     --select-option-bg-hover: rgba(99, 102, 241, 0.15);
   }
   ```

### Датасеты

`NgpKitDataService` предоставляет готовые источники данных:

- `getCountryTimezoneGroups()` — сгруппированные по континентам страны с таймзонами (взято из пакета `countries-and-timezones`).
- `getCountryOptions()` — подготовленные опции для `<ngp-select>`/`<ngp-combobox>`.
- `getTimezoneGroups()` — полный список таймзон с UTC-смещением.

Вы можете использовать их напрямую или передать в компоненты через `dataset`:

```html
<ngp-select dataset="countries" clearable></ngp-select>
<ngp-combobox dataset="timezones" appearance="field"></ngp-combobox>
```

### Компоненты

Все компоненты — standalone, поэтому их достаточно добавить в `imports` нужного standalone компонента или роутового `Component`. Ниже приведены краткие примеры использования.

#### `<ngp-select>`

```ts
import { NgpSelectComponent } from 'src/app/shared/kit';

@Component({
  standalone: true,
  imports: [CommonModule, NgpSelectComponent],
  template: `
    <ngp-select
      [options]="statusOptions"
      placeholder="Выберите статус"
      clearable
    ></ngp-select>
  `,
})
export class StatusFilterComponent {
  readonly statusOptions = [
    { label: 'Черновик', value: 'draft' },
    { label: 'Опубликовано', value: 'published' },
  ];
}
```

Особенности:
- `dataset="countries" | "timezones"` — автоматическое наполнение.
- `compareWith`, `clearable`, `panelMaxHeight` — настройки поведения и вида.
- Все состояния управляются через CSS-переменные (`--select-*`).

#### `<ngp-combobox>`

Поддерживает поиск, разные режимы триггера (`triggerMode="field" | "button"`) и те же датасеты.

```html
<ngp-combobox
  dataset="countries"
  searchable
  clearable
  (valueChange)="onCountry($event)"
></ngp-combobox>
```

#### `<ngp-radio-group>` и `<ngp-checkbox-group>`

Работают как `ControlValueAccessor`, принимают массив `NgpOption<T>` и поддерживают горизонтальное/вертикальное расположение:

```html
<ngp-radio-group
  legend="Тип проекта"
  layout="horizontal"
  [(ngModel)]="projectType"
  [options]="typeOptions"
></ngp-radio-group>
```

#### `<ngp-switch>` и `<ngp-toggle>`

Компоненты для булевых состояний. `ngp-switch` — аналог тумблера с режимами `primary/success/danger`; `ngp-toggle` — кнопка с внешним видом `solid/soft/outline`.

```html
<ngp-switch
  [(ngModel)]="notifications"
  checkedLabel="Вкл"
  uncheckedLabel="Выкл"
></ngp-switch>

<ngp-toggle
  [(ngModel)]="favorite"
  label="В избранное"
  activeLabel="В избранном"
  appearance="solid"
></ngp-toggle>
```

#### `<ngp-tabs>` + `<ngp-tab>`

Табы строятся через проекцию `ngp-tab`.

```html
<ngp-tabs appearance="pill" [(ngModel)]="activeTab">
  <ngp-tab id="overview" label="Обзор">…контент…</ngp-tab>
  <ngp-tab id="activity" label="Активность" [disabled]="isLoading">
    …
  </ngp-tab>
</ngp-tabs>
```

Не забудьте добавить `NgpTabsComponent` и `NgpTabDirective` в `imports` потребителя.

#### `<ngp-dialog>`

Диалог поддерживает:
- Анимации: `fade`, `scale`, `slide-up`.
- Встраивание шаблона через `<ng-content>` или динамического компонента через `contentComponent`.
- Кнопки с действиями и возврат событий через `action`.

Пример:

```html
<ngp-dialog
  [open]="showDialog"
  animation="slide-up"
  size="lg"
  [config]="{
    heading: 'Создать проект',
    subheading: 'Укажите основные параметры',
    buttons: [
      { label: 'Отмена', action: 'close', appearance: 'link' },
      { label: 'Сохранить', action: 'submit', appearance: 'primary' }
    ]
  }"
  (action)="handleDialogAction($event)"
>
  <project-form (submit)="handleDialogAction({ action: 'submit', value: $event })"></project-form>
</ngp-dialog>
```

Чтобы подключить другой компонент программно, используйте `contentComponent` и передайте `contentInputs` / `contentOutputs`.

### Темизация и переопределения

- Глобально: назначайте одну из тем на `body` или используйте свою через mixin.
- Локально: переопределяйте CSS-переменные у конкретного компонента (`--select-bg`, `--combobox-option-bg-selected`, `--dialog-backdrop` и т.д.).
- Комбинированно: создайте SCSS-файл с темой и подключите его в нужном месте (`@include theme-halloween.scss`).

### Зависимости

- Добавлен пакет [`countries-and-timezones`](https://www.npmjs.com/package/countries-and-timezones) для генерации полного списка стран и таймзон.
- При сборке возможны предупреждения о превышении CSS-бюджета для `ngp-select` и `ngp-combobox`. Это ожидаемо из-за расширенных стилей; при необходимости отрегулируйте бюджет или минифицируйте стили.
