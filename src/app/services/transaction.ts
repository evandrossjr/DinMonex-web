import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../model/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiUrl = 'https://dimonex.onrender.com/api/transactions';

  constructor(private http: HttpClient) { }

  /**
   * Busca TODAS as transações do utilizador autenticado,
   * independentemente do tipo.
   */
  getAllMyTransactions(): Observable<Transaction[]> {
    // Este endpoint é mais genérico e será a nossa fonte principal de dados para o dashboard.
    return this.http.get<Transaction[]>(`${this.apiUrl}`);
  }

  getConsumptionTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/consumption`);
  }

  getConsumptionTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/consumption/${id}`);
  }

  createConsumptionTransaction(transactionData: Partial<Transaction>): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/consumption`, transactionData);
  }

  updateConsumptionTransaction(id: number, transactionData: Partial<Transaction>): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/consumption/${id}`, transactionData);
  }

  deleteConsumptionTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/consumption/${id}`);
  }

  createCreditCardTransaction(transactionData: any): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/credit-card`, transactionData);
  }
}

