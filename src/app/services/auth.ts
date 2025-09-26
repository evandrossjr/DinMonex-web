import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Importa o operador tap

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'dinmonex_auth_token'; // Chave para guardar o token no armazenamento local

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      // O operador 'tap' permite-nos executar uma ação com o resultado sem o modificar.
      tap(response => {
        // Se a resposta da API contiver um token, guarda-o.
        if (response && response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  /**
   * Guarda o token JWT no localStorage do navegador.
   * O localStorage persiste mesmo se o utilizador fechar o navegador.
   * @param token O token JWT recebido da API.
   */
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Obtém o token JWT do localStorage.
   * @returns O token, se existir, ou nulo.
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Remove o token do localStorage. Essencial para a funcionalidade de logout.
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Verifica se o utilizador está autenticado.
   * A verificação mais simples é ver se um token existe no armazenamento.
   * @returns Verdadeiro se o utilizador tiver um token, falso caso contrário.
   */
  isLoggedIn(): boolean {
    // A dupla negação (!!) transforma o resultado (uma string ou nulo) num booleano (verdadeiro ou falso).
    return !!this.getToken();
  }
}

