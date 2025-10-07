import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../model/transaction.model';
import { Installment } from '../../model/installment.model'; // 1. Importa o nosso modelo de Parcela
import { TransactionService } from '../../services/transaction';
import { TransactionFormComponent } from '../../components/transaction-form/transaction-form';
import { InstallmentListComponent } from '../../components/installment-list/installment-list'; // 2. Importa o nosso novo componente de lista de parcelas
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // 3. Adiciona o InstallmentListComponent aos imports.
  imports: [CommonModule, TransactionFormComponent, InstallmentListComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {

  transactions: Transaction[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  // Propriedades para gerir o modal de formulário
  isTransactionModalVisible = false;
  selectedTransactionId: number | null = null; 
  
  // --- NOVAS PROPRIEDADES PARA GERIR O MODAL DE PARCELAS ---
  isInstallmentModalVisible = false;
  selectedTransactionInstallments: Installment[] = [];

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
    // (Esta chamada ao backend precisa de ser criada para retornar as transações com as suas parcelas)
    this.transactionService.getAllMyTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Não foi possível carregar as transações.';
        this.isLoading = false;
        console.error('Erro ao carregar transações:', err);
      }
    });
  }

  // --- MÉTODOS PARA O MODAL DE FORMULÁRIO ---

  openAddModal(): void {
    this.selectedTransactionId = null;
    this.isTransactionModalVisible = true;
  }

  openEditModal(id: number): void {
    this.selectedTransactionId = id;
    this.isTransactionModalVisible = true;
  }

  onCloseTransactionModal(): void {
    this.isTransactionModalVisible = false;
    this.selectedTransactionId = null;
  }

  onFormSaved(): void {
    this.loadTransactions();
  }

  deleteTransaction(id: number): void {
    this.transactionService.deleteConsumptionTransaction(id).subscribe({
      next: () => this.loadTransactions(),
      error: (err) => console.error(err)
    });
  }
  
  // --- NOVOS MÉTODOS PARA O MODAL DE PARCELAS ---
  
  /**
   * Abre o modal de parcelas e passa os dados da transação selecionada.
   * @param transaction A transação cujas parcelas serão exibidas.
   */
  openInstallmentModal(transaction: Transaction): void {
    if (transaction.installments && transaction.installments.length > 0) {
      this.selectedTransactionInstallments = transaction.installments;
      this.isInstallmentModalVisible = true;
    }
  }

  /**
   * Fecha o modal de parcelas.
   */
  onCloseInstallmentModal(): void {
    this.isInstallmentModalVisible = false;
    this.selectedTransactionInstallments = []; // Limpa a lista de parcelas
  }

  logout(): void {
    this.authService.logout();
  }
}

