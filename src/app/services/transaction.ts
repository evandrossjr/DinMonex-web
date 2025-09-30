import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../model/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  // A URL base para os nossos endpoints de transações.
  private apiUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) { }

  /**
   * Busca todas as transações do tipo 'CONSUMPTION' do utilizador autenticado.
   * O token JWT será adicionado automaticamente pelo nosso futuro HttpInterceptor.
   * @returns Um Observable com um array de transações.
   */
  getConsumptionTransactions(): Observable<Transaction[]> {
    return this.http.get<any[]>(`${this.apiUrl}/consumption`);
  }
}
