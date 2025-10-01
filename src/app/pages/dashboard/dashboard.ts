import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../model/transaction.model';
import { TransactionService } from '../../services/transaction';
import { TransactionFormComponent } from '../../components/transaction-form/transaction-form'; // 1. Importa o nosso novo componente de formulário

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // 2. Adiciona o TransactionFormComponent aos imports.
  imports: [CommonModule, TransactionFormComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {

  transactions: Transaction[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  // --- NOVAS PROPRIEDADES PARA GERIR O MODAL ---
  isModalVisible = false;
  // Guarda o ID da transação que estamos a editar. Nulo se estivermos a criar.
  selectedTransactionId: number | null = null; 

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.loadTransactions(); // Extraímos a lógica de carregamento para um método separado.
  }

  // --- MÉTODOS PARA GERIR O MODAL E OS DADOS ---

  /**
   * Carrega ou recarrega a lista de transações da API.
   */
  loadTransactions(): void {
    this.isLoading = true;
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

  /**
   * Abre o modal em modo de criação.
   */
  openAddModal(): void {
    this.selectedTransactionId = null; // Garante que não estamos em modo de edição.
    this.isModalVisible = true;
  }

  /**
   * Abre o modal em modo de edição.
   * @param id O ID da transação a ser editada.
   */
  openEditModal(id: number): void {
    this.selectedTransactionId = id; // Define o ID para o modo de edição.
    this.isModalVisible = true;
  }

  /**
   * Fecha o modal.
   */
  onCloseModal(): void {
    this.isModalVisible = false;
    this.selectedTransactionId = null; // Limpa o ID selecionado.
  }

  /**
   * Chamado quando o formulário emite o evento 'formSaved'.
   * Recarrega a lista de transações para mostrar os dados atualizados.
   */
  onFormSaved(): void {
    this.loadTransactions();
  }
}

