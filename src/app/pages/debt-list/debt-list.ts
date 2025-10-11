import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { DebtService } from '../../services/debt';
import { SharedDebt } from '../../model/sharedDebt.model';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-debt-list',
  standalone: true,
  // 2. Adicione DatePipe e CurrencyPipe ao array de imports.
  // O RouterLink também é necessário para o link de navegação no seu HTML.
  imports: [CommonModule, DatePipe, CurrencyPipe, RouterLink],
  templateUrl: './debt-list.html',
  styleUrl: './debt-list.scss'
})
export class DebtListComponent implements OnInit {

  // Propriedades para guardar o estado do componente
  pendingInvitations: SharedDebt[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  // Injeta o DebtService para podermos comunicar com a API.
  constructor(private debtService: DebtService) { }

  ngOnInit(): void {
    this.loadInvitations();
  }

  /**
   * Carrega ou recarrega a lista de convites pendentes.
   */
  loadInvitations(): void {
    this.isLoading = true;
    this.error = null;
    this.debtService.getSharedDebts().subscribe({
      next: (data) => {
        this.pendingInvitations = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Não foi possível carregar os seus convites de dívida.';
        this.isLoading = false;
        console.error('Erro ao carregar convites:', err);
      }
    });
  }

  /**
   * Chamado quando o utilizador clica em "Aceitar".
   * @param debtId O ID do convite a ser aceite.
   */
  accept(debtId: number): void {
    this.debtService.acceptSharedDebt(debtId).subscribe({
      next: () => {
        // Em caso de sucesso, recarrega a lista para remover o convite respondido.
        this.loadInvitations();
      },
      error: (err) => {
        console.error(`Erro ao aceitar o convite ${debtId}:`, err);
        this.error = 'Não foi possível responder ao convite.';
      }
    });
  }

  /**
   * Chamado quando o utilizador clica em "Recusar".
   * @param debtId O ID do convite a ser recusado.
   */
  reject(debtId: number): void {
    this.debtService.declineSharedDebt(debtId).subscribe({
      next: () => {
        this.loadInvitations();
      },
      error: (err) => {
        console.error(`Erro ao recusar o convite ${debtId}:`, err);
        this.error = 'Não foi possível responder ao convite.';
      }
    });
  }
}
