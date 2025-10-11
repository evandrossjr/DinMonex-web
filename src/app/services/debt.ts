import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedDebt } from '../model/sharedDebt.model';


@Injectable({
  providedIn: 'root'
})
export class DebtService {
  
  private apiUrl = 'http://localhost:8080/api/debts'; // URL da API backend

  constructor(private http: HttpClient) { }

  /**
   * Cria um novo convite de dívida partilhada.
   * @param debtData Os dados da dívida, incluindo o e-mail do convidado.
   */
  createdSharedDebt(debtdata: any): Observable<SharedDebt> {
    return this.http.post<SharedDebt>(this.apiUrl, debtdata);
  }

  /**
   * Obtém todas as dívidas partilhadas do usuário autenticado.
   */
  getSharedDebts(): Observable<SharedDebt[]> {
    return this.http.get<SharedDebt[]>(`${this.apiUrl}/invitations/pending`);
  }

  /**
   * Aceita um convite de dívida partilhada.
   * @param debtId O ID da dívida a ser aceita.
   */
  acceptSharedDebt(debtId: number): Observable<SharedDebt> {
    return this.http.post<SharedDebt>(`${this.apiUrl}/invitations/${debtId}/accept`, {});
  }

  /**
   * Recusa um convite de dívida partilhada.
   * @param debtId O ID da dívida a ser recusada.
   */
  declineSharedDebt(debtId: number): Observable<SharedDebt> {
    return this.http.post<SharedDebt>(`${this.apiUrl}/invitations/${debtId}/decline`, {});
  }

}
