import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

/**
 * Este é um HttpInterceptor. A sua função é interceptar todos os pedidos HTTP
 * que saem da aplicação para modificar ou adicionar informação a eles.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Injeta o nosso AuthService para podermos aceder ao token.
  const authService = inject(AuthService);
  const authToken = authService.getToken();

  // Verifica se temos um token guardado.
  if (authToken) {
    // Se tivermos um token, clona o pedido original e adiciona um novo cabeçalho (header).
    // O cabeçalho 'Authorization' com o valor 'Bearer [token]' é o padrão para JWT.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });

    // Envia o pedido modificado para o próximo passo da cadeia.
    return next(authReq);
  }

  // Se não houver token, simplesmente deixa o pedido original continuar sem modificações.
  return next(req);
};

