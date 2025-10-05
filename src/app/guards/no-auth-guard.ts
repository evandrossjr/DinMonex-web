import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * Este guarda protege as rotas públicas (como login e registo).
 * Ele impede que um utilizador já autenticado aceda a estas páginas,
 * redirecionando-o para o dashboard.
 */
@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    // Pergunta ao AuthService se o utilizador está logado.
    if (this.authService.isLoggedIn()) {
      // Se sim, redireciona para o dashboard.
      this.router.navigate(['/dashboard']);
      // E nega o acesso à rota de login/registo.
      return false;
    } else {
      // Se não estiver logado, permite o acesso.
      return true;
    }
  }
}
