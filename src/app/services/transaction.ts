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

  /**
   * NOVO: Busca uma única transação de consumo pelo seu ID.
   */
  getConsumptionTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/consumption/${id}`);
  }

  /**
   * Cria uma nova transação de consumo.
   * @param transactionData Os dados da transação a ser criada.
   */
  createConsumptionTransaction(transactionData: Partial<Transaction>): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/consumption`, transactionData);
  }

  /**
   * Atualiza uma transação de consumo existente.
   * @param id O ID da transação a ser atualizada.
   * @param transactionData Os novos dados da transação.
   */
  updateConsumptionTransaction(id: number, transactionData: Partial<Transaction>): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/consumption/${id}`, transactionData);
  }

  /**
   * Apaga uma transação de consumo.
   * @param id O ID da transação a ser apagada.
   */
  deleteConsumptionTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/consumption/${id}`);
  }
}
