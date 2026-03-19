// ================= ANGULAR ROUTING =================
import { Routes } from '@angular/router';

// ================= COMPONENT IMPORTS =================
import { HomeComponent } from './home/home';
import { PinnedBooksComponent } from './pinned-books/pinned-books';
import { SearchLogsComponent } from './search-logs/search-logs';
import { LoginComponent } from './login/login';

import { HelpComponent } from './help/Help';  // ← ADD THIS

export const routes: Routes = [

  // TEST NEW UI
  { path: 'help', component: HelpComponent }, 

  // 🔐 LOGIN ROUTE
  { path: 'login', component: LoginComponent },

  // Redirect root to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ================= PROTECTED PAGES =================
  { path: 'home', component: HomeComponent },
  { path: 'pinned-books', component: PinnedBooksComponent },
  { path: 'search-logs', component: SearchLogsComponent },

  {
    path: 'manage-account',
    loadComponent: () =>
      import('./account/account')
        .then(m => m.AccountComponent)
  },

  {
    path: 'reset-password',
    loadComponent: () =>
      import('./reset-password/reset-password')
        .then(m => m.ResetPasswordComponent)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./register/register')
        .then(m => m.RegisterComponent)
  },

  // Wildcard
  { path: '**', redirectTo: 'login' }
];