// 1. Importa o tipo Routes (APENAS UMA VEZ)
import { Routes } from '@angular/router';

// 2. Importa os componentes que vamos usar (APENAS UMA VEZ)
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard';

// 3. Define e exporta o array de rotas (APENAS UMA VEZ)
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];


