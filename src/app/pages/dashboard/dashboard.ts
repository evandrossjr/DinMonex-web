import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../model/transaction.model';
import { TransactionService } from '../../services/transaction';
import { TransactionFormComponent } from '../../components/transaction-form/transaction-form';
import { AuthService } from '../../services/auth'; // 1. Importa o nosso AuthService

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TransactionFormComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {

  transactions: Transaction[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  isModalVisible = false;
  selectedTransactionId: number | null = null; 

  // 2. Injeta o AuthService no construtor.
  constructor(
    private transactionService: TransactionService, 
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.error = null;
    this.transactionService.getConsumptionTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Não foi possível carregar as transações. Por favor, tente novamente mais tarde.';
        this.isLoading = false;
        console.error('Erro ao carregar transações:', err);
      }
    });
  }

  // --- MÉTODOS DE GESTÃO DO MODAL ---
  openAddModal(): void {
    this.selectedTransactionId = null;
    this.isModalVisible = true;
  }

  openEditModal(id: number): void {
    this.selectedTransactionId = id;
    this.isModalVisible = true;
  }

  deleteTransaction(id: number): void {
    this.transactionService.deleteConsumptionTransaction(id).subscribe({
      next: () => {
        this.loadTransactions();
      },
      error: (err) => {
        this.error = 'Não foi possível apagar a transação.';
        console.error(`Erro ao apagar a transação ${id}:`, err);
      }
    });
  }

  onCloseModal(): void {
    this.isModalVisible = false;
    this.selectedTransactionId = null;
  }

  onFormSaved(): void {
    this.loadTransactions();
  }

  /**
   * Chama o método de logout do AuthService.
   */
  logout(): void {
    this.authService.logout();
  }
}

