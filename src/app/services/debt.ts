import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedDebt } from '../model/sharedDebt.model';

@Injectable({
  providedIn: 'root'
})
export class DebtService {

  private apiUrl = 'http://localhost:8080/api/debts';

  constructor(private http: HttpClient) { }

  /**
   * Cria um novo convite de dívida partilhada.
   */
  createSharedDebt(debtData: any): Observable<SharedDebt> {
    return this.http.post<SharedDebt>(this.apiUrl, debtData);
  }

  /**
   * Busca todos os convites de dívida pendentes para o utilizador logado.
   */
  getMyPendingInvitations(): Observable<SharedDebt[]> {
    return this.http.get<SharedDebt[]>(`${this.apiUrl}/invitations/pending`);
  }

  /**
   * Aceita um convite de dívida.
   */
  acceptInvitation(debtId: number): Observable<SharedDebt> {
    return this.http.post<SharedDebt>(`${this.apiUrl}/invitations/${debtId}/accept`, {});
  }

  /**
   * Recusa um convite de dívida.
   */
  rejectInvitation(debtId: number): Observable<SharedDebt> {
    return this.http.post<SharedDebt>(`${this.apiUrl}/invitations/${debtId}/reject`, {});
  }

  /**
   * NOVO: Busca todas as dívidas criadas pelo utilizador logado.
   */
  getMyCreatedDebts(): Observable<SharedDebt[]> {
    return this.http.get<SharedDebt[]>(`${this.apiUrl}/created-by-me`);
  }

  /**
   * NOVO: Busca todas as dívidas partilhadas com o utilizador logado que ele já aceitou.
   */
  getDebtsSharedWithMe(): Observable<SharedDebt[]> {
    return this.http.get<SharedDebt[]>(`${this.apiUrl}/shared-with-me`);
  }
}

