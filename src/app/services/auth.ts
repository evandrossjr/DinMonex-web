import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// O HttpClient precisa ser provido na aplicação. Você precisará adicionar
// a linha 'provideHttpClient()' no array de providers do seu arquivo app.config.ts
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // A URL base da sua API backend.
  // Durante o desenvolvimento, será http://localhost:8080
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  /**
   * Envia uma requisição de cadastro para a API.
   * @param userData Os dados do usuário (nome, email, senha).
   * @returns Um Observable com a resposta da API.
   */
  register(userData: any): Observable<any> {
    // A linha abaixo é a que fará a chamada real para o seu backend.
    // Descomente-a quando seu backend estiver rodando.
    // return this.http.post(`${this.apiUrl}/register`, userData);
    
    // Por enquanto, vamos apenas simular a chamada e logar no console.
    console.log('Dados enviados para o serviço de registro:', userData);
    return new Observable(observer => {
      observer.next({ message: 'Cadastro enviado com sucesso! (Simulado)' });
      observer.complete();
    });
  }
}
