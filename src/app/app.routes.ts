import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { TaskList } from './features/tasks/pages/task-list/task-list';

export const routes: Routes = [
  {
    path: '',
    component: TaskList,
    canActivate: [authGuard],
  },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Register },
  { path: '**', redirectTo: '' },
];
