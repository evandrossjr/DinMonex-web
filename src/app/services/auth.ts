import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router'; // Importa o Router para navegação

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'dinmonex_auth_token';

  constructor(private http: HttpClient, private router: Router) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * NOVO MÉTODO: Faz o logout do utilizador.
   * Apaga o token e redireciona para a página de login.
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  /**
   * MÉTODO MELHORADO: Verifica se o utilizador está logado E se o token não expirou.
   */
  isLoggedIn(): boolean {
    const token = this.getToken();

    // Se não houver token, o utilizador não está logado.
    if (!token) {
      return false;
    }

    // Decodifica o payload do token para verificar a data de expiração.
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // O 'exp' (expiration) do JWT é em segundos, enquanto o Date.now() é em milissegundos.
    const expiry = payload.exp * 1000;
    
    // Se a data de expiração for no futuro, o token é válido.
    return expiry > Date.now();
  }
}

