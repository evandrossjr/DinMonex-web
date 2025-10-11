import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { DebtListComponent } from './pages/debt-list/debt-list';
import { AuthGuard } from './guards/auth-guard'; 
import { NoAuthGuard } from './guards/no-auth-guard'; // 1. Importa o nosso novo NoAuthGuard


export const routes: Routes = [
  // 2. Protege as rotas de login e registo com o NoAuthGuard.
  // Apenas utilizadores NÃO logados podem aceder a estas rotas.
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  
  // A rota do dashboard continua protegida pelo AuthGuard.
  // Apenas utilizadores LOGADOS podem aceder.
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard]
  },
  
  { path: 'debts', 
    component: DebtListComponent, 
    canActivate: [AuthGuard] 
  },

  // O redirecionamento padrão pode ir para o login. Se o utilizador já estiver logado,
  // o NoAuthGuard irá redirecioná-lo para o dashboard.
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

