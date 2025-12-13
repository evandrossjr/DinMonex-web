import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../model/transaction.model';
import { environment } from '../../environments/environment';




export interface ResumeTransactionDTO {
  totalGeral: number;
  totalPago: number;
  totalPendente: number;
}

export interface TransactionGroup {
  id: number;
  name: string;
  hexColor: string;
}

@Injectable({
  providedIn: 'root'
})

export class TransactionService {

  private apiUrl = `${environment.apiUrl}/api/transactions`;

  constructor(private http: HttpClient) { }



  getResumeTransactions(mes: number, ano: number): Observable<ResumeTransactionDTO> {
    const params = new HttpParams()
      .set('mes', mes.toString())
      .set('ano', ano.toString());  

    return this.http.get<ResumeTransactionDTO>(`${this.apiUrl}/dashboard/resumo`, { params });
  }


  /**
   * Busca TODAS as transações do utilizador autenticado,
   * independentemente do tipo.
   */
  getAllMyTransactions(mes: number, ano: number): Observable<Transaction[]> {
    const params = new HttpParams()
      .set('mes', mes.toString())
      .set('ano', ano.toString());

    return this.http.get<Transaction[]>(`${this.apiUrl}`, { params });
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

  createCreditCardTransaction(transactionData: any): Observable<Transaction[]> {
    return this.http.post<Transaction[]>(`${this.apiUrl}/credit-card`, transactionData);
  }

  patchPay(id: number, status: boolean): Observable<void> {
    const body = { paid: status };
    return this.http.patch<void>(`${this.apiUrl}/${id}/pay`, body);
  }

  getAllTransactionGroups(): Observable<TransactionGroup[]> {
    return this.http.get<TransactionGroup[]>(`${this.apiUrl}/groups`);
  } 

  createGroupTransaction(groupData: {name: string, hexColor: string}): Observable<TransactionGroup> {
    return this.http.post<TransactionGroup>(`${this.apiUrl}/groups`, groupData);
  }

  

}