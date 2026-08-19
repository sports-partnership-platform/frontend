import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'partners',
    loadComponent: () => import('./features/partners/partners.component').then(m => m.PartnersComponent)
  },
  {
    path: 'hierarchy',
    loadComponent: () => import('./features/hierarchy/hierarchy.component').then(m => m.HierarchyComponent)
  },
  {
    path: 'partnership',
    loadComponent: () => import('./features/partnership/partnership.component').then(m => m.PartnershipComponent)
  },
  {
    path: 'transactions',
    loadComponent: () => import('./features/transactions/transactions.component').then(m => m.TransactionsComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
