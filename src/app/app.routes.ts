import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'partners',
    canActivate: [authGuard],
    loadComponent: () => import('./features/partners/partners.component').then(m => m.PartnersComponent)
  },
  {
    path: 'hierarchy',
    canActivate: [authGuard],
    loadComponent: () => import('./features/hierarchy/hierarchy.component').then(m => m.HierarchyComponent)
  },
  {
    path: 'partnership',
    canActivate: [authGuard],
    loadComponent: () => import('./features/partnership/partnership.component').then(m => m.PartnershipComponent)
  },
  {
    path: 'transactions',
    canActivate: [authGuard],
    loadComponent: () => import('./features/transactions/transactions.component').then(m => m.TransactionsComponent)
  },
  {
    path: 'reports',
    canActivate: [authGuard],
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
