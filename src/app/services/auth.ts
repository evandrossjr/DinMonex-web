import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// O HttpClient precisa de ser provido na sua aplicação.
// Lembre-se de adicionar 'provideHttpClient()' no array de providers do seu ficheiro app.config.ts
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // A URL base da sua API backend.
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  /**
   * Envia um pedido de registo para a API.
   * @param userData Os dados do utilizador (nome, email, senha).
   * @returns Um Observable com a resposta da API.
   */
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  /**
   * NOVO MÉTODO: Envia um pedido de login para a API.
   * @param credentials As credenciais do utilizador (email, senha).
   * @returns Um Observable com a resposta da API (que deverá conter o token JWT).
   */
  login(credentials: any): Observable<any> {
    // A chamada real para o seu backend.
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
}
