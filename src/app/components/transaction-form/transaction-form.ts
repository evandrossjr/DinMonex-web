import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../model/transaction.model';
import { TransactionService } from '../../services/transaction';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.scss'
})
export class TransactionFormComponent implements OnInit {

  // --- Entradas e Saídas do Componente ---

  // @Input() permite que o componente pai (Dashboard) nos envie dados.
  // Usaremos isto para passar o ID da transação a ser editada.
  // Se for nulo, significa que estamos a criar uma nova transação.
  @Input() transactionId: number | null = null;

  // @Output() permite-nos enviar eventos para o componente pai.
  @Output() closeModal = new EventEmitter<void>();
  @Output() formSaved = new EventEmitter<void>();

  // --- Propriedades Internas ---

  transactionForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService
  ) {
    // Inicializamos o formulário no construtor com a sua estrutura e validações.
    this.transactionForm = this.fb.group({
      description: ['', [Validators.required]],
      value: [null, [Validators.required, Validators.min(0.01)]],
      dueDate: ['', [Validators.required]],
      isRecurring: [false, [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Verificamos se um ID foi passado quando o componente foi inicializado.
    if (this.transactionId !== null) {
      this.isEditMode = true;
      this.isLoading = true;
      // Se estivermos no modo de edição, vamos buscar os dados da transação à API.
      this.transactionService.getConsumptionTransactionById(this.transactionId).subscribe({
        next: (transaction) => {
          // Preenchemos o formulário com os dados recebidos.
          this.transactionForm.patchValue(transaction);
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Não foi possível carregar os dados da transação.';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }

  // Método chamado quando o formulário é submetido.
  onSubmit(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.transactionForm.value;

    if (this.isEditMode && this.transactionId) {
      // Se estivermos a editar, chamamos o método de atualização.
      this.transactionService.updateConsumptionTransaction(this.transactionId, formData).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err)
      });
    } else {
      // Se estivermos a criar, chamamos o método de criação.
      this.transactionService.createConsumptionTransaction(formData).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err)
      });
    }
  }

  // --- Métodos de Ajuda ---

  // Lida com o sucesso do envio do formulário.
  private handleSuccess(): void {
    this.isLoading = false;
    this.formSaved.emit(); // Emite o evento para avisar o pai que os dados foram salvos.
    this.onClose();
  }

  // Lida com erros no envio do formulário.
  private handleError(error: any): void {
    this.isLoading = false;
    this.errorMessage = 'Ocorreu um erro ao salvar a transação. Tente novamente.';
    console.error(error);
  }

  // Emite o evento para fechar o modal.
  onClose(): void {
    this.closeModal.emit();
  }
}
