import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../model/transaction.model'; // 1. Importa o nosso modelo de dados
import { TransactionService } from '../../services/transaction'; // 2. Importa o nosso serviço de transações

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // O CommonModule é necessário para usar diretivas como *ngFor e *ngIf no nosso HTML.
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {

  // 3. Cria propriedades para guardar o estado do nosso componente.
  transactions: Transaction[] = []; // Irá guardar a lista de transações recebida da API.
  isLoading: boolean = true;      // Controla se devemos mostrar um indicador de "a carregar".
  error: string | null = null;    // Guarda qualquer mensagem de erro que possa ocorrer.

  // 4. Injeta o TransactionService para que o possamos usar.
  constructor(private transactionService: TransactionService) { }

  /**
   * ngOnInit é um "gancho de ciclo de vida" do Angular.
   * O código dentro dele é executado automaticamente assim que o componente é inicializado.
   * É o sítio perfeito para ir buscar os dados iniciais.
   */
  ngOnInit(): void {
    // 5. Chama o método do nosso serviço para ir buscar os dados.
    this.transactionService.getConsumptionTransactions().subscribe({
      // O 'next' é executado quando a API responde com sucesso.
      next: (data) => {
        this.transactions = data; // Guarda os dados recebidos na nossa propriedade.
        this.isLoading = false;   // Desliga o indicador de "a carregar".
        console.log('Transações carregadas com sucesso:', this.transactions);
      },
      // O 'error' é executado se a API responder com um erro.
      error: (err) => {
        this.error = 'Não foi possível carregar as transações. Por favor, tente novamente mais tarde.';
        this.isLoading = false; // Desliga o indicador de "a carregar" mesmo em caso de erro.
        console.error('Erro ao carregar transações:', err);
      }
    });
  }
}
