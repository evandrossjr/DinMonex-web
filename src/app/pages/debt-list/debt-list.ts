import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // 1. Importa o RouterLink para a navegação
import { SharedDebt } from '../../model/sharedDebt.model';
import { DebtService } from '../../services/debt';
import { AuthService } from '../../services/auth'; // 2. Importa o AuthService para o logout

@Component({
  selector: 'app-debt-list',
  standalone: true,
  // 3. Adiciona RouterLink aos imports.
  imports: [CommonModule, RouterLink],
  templateUrl: './debt-list.html',
  styleUrl: './debt-list.scss'
})
export class DebtListComponent implements OnInit {

  pendingInvitations: SharedDebt[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  // 4. Injeta o AuthService para o podermos usar.
  constructor(private debtService: DebtService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadInvitations();
  }

  loadInvitations(): void {
    this.isLoading = true;
    this.error = null;
    this.debtService.getMyPendingInvitations().subscribe({
      next: (data) => {
        this.pendingInvitations = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Não foi possível carregar os seus convites de dívida.';
        this.isLoading = false;
      }
    });
  }

  accept(debtId: number): void {
    this.debtService.acceptInvitation(debtId).subscribe({
      next: () => this.loadInvitations(),
      error: (err) => this.error = 'Não foi possível responder ao convite.'
    });
  }

  reject(debtId: number): void {
    this.debtService.rejectInvitation(debtId).subscribe({
      next: () => this.loadInvitations(),
      error: (err) => this.error = 'Não foi possível responder ao convite.'
    });
  }

  /**
   * 5. Adiciona o método de logout que será chamado pelo botão.
   */
  logout(): void {
    this.authService.logout();
  }
}

