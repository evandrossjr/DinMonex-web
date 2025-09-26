import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * Este é um Guarda de Rota. A sua função é proteger rotas contra acesso não autorizado.
 * Ele implementa a interface CanActivate.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // Injetamos o AuthService para verificar se o utilizador está logado,
  // e o Router para o podermos redirecionar.
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Este é o método que o Angular Router chama antes de ativar uma rota.
   * @returns Verdadeiro se o utilizador puder aceder à rota, falso caso contrário.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    // Pergunta ao AuthService se o utilizador está logado (se tem um token).
    if (this.authService.isLoggedIn()) {
      // Se sim, permite o acesso.
      return true;
    } else {
      // Se não, redireciona o utilizador para a página de login.
      this.router.navigate(['/login']);
      // E nega o acesso à rota protegida.
      return false;
    }
  }
}

