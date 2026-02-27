import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/main/main.page').then((m) => m.MainPage),
    title: 'Create Web3 Projects',
  },
  {
    path: '', // Пустой путь, чтобы урлы остались короткими
    loadComponent: () => import('./pages/inner/inner.page').then((m) => m.InnerPage),
    children: [
      {
        path: 'privacy-policy',
        loadComponent: () =>
          import('./pages/inner/sub-pages/privacy-policy/privacy-policy.page').then(
            (m) => m.PrivacyPolicyPage,
          ),
      },
      {
        path: 'cookie-policy',
        loadComponent: () =>
          import('./pages/inner/sub-pages/cookie-policy/cookie-policy.page').then(
            (m) => m.CookiePolicyPage,
          ),
      },
      {
        path: 'terms',
        loadComponent: () =>
          import('./pages/inner/sub-pages/terms/terms.page').then((m) => m.TermsPage),
      },
      {
        // Судя по вашему скрину, legal-notice лежит в sub-pages
        path: 'legal-notice',
        loadComponent: () =>
          import('./pages/inner/sub-pages/legal-notice/legal-notice.page').then(
            (m) => m.LegalNoticePage, // Проверьте точное название класса
          ),
      },
      {
        path: '404',
        loadComponent: () => import('./pages/not-found/not-found.page').then((m) => m.NotFoundPage),
      },
    ],
  },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found.page').then((m) => m.NotFoundPage),
  },

  {
    path: '**',
    redirectTo: '404',
    // If need to save url
    // loadComponent: () => import('../pages/not-found/ui/not-found.page').then(m => m.NotFoundPage)
  },
];
