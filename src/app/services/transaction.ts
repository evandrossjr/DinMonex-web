import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../model/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) { }

  // --- MÉTODOS EXISTENTES ---

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


  /**
   * Cria uma nova transação de cartão de crédito (parcelada).
   * @param transactionData Os dados da compra, incluindo o número de parcelas.
   */
  createCreditCardTransaction(transactionData: any): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/credit-card`, transactionData);
  }
}

