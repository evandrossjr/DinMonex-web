import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../model/transaction.model';
import { TransactionService } from '../../services/transaction';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.scss'
})
export class TransactionFormComponent implements OnInit {

  @Input() transactionId: number | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() formSaved = new EventEmitter<void>();

  transactionForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  errorMessage: string | null = null;

  // Propriedade para guardar os tipos de transação
  transactionTypes = ['CONSUMPTION', 'CREDIT_CARD'];

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService
  ) {
    // Inicializamos o formulário com todos os campos possíveis.
    this.transactionForm = this.fb.group({
      // Campo para o tipo de transação, obrigatório.
      type: ['CONSUMPTION', [Validators.required]], 
      description: ['', [Validators.required]],
      value: [null, [Validators.required, Validators.min(0.01)]],
      dueDate: ['', [Validators.required]],
      // Campo para Contas de Consumo
      isRecurring: [false],
      // Campo para Cartão de Crédito
      totalInstallments: [1, [Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.setupConditionalValidators(); // Configura os validadores dinâmicos

    if (this.transactionId !== null) {
      this.isEditMode = true;
      this.isLoading = true;
      // No modo de edição, desabilitamos o seletor de tipo para não permitir a sua alteração.
      this.transactionForm.get('type')?.disable(); 
      
      this.transactionService.getConsumptionTransactionById(this.transactionId).subscribe({
        next: (transaction) => {
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

  /**
   * Configura a lógica para adicionar/remover validadores com base no tipo de transação.
   */
  private setupConditionalValidators(): void {
    const typeControl = this.transactionForm.get('type');
    const isRecurringControl = this.transactionForm.get('isRecurring');
    const totalInstallmentsControl = this.transactionForm.get('totalInstallments');

    // "Escuta" as mudanças no campo 'type'.
    typeControl?.valueChanges.subscribe(type => {
      if (type === 'CONSUMPTION') {
        // Se for consumo, o campo 'isRecurring' é obrigatório.
        isRecurringControl?.setValidators([Validators.required]);
        // E o campo de parcelas não é obrigatório.
        totalInstallmentsControl?.clearValidators();
      } else if (type === 'CREDIT_CARD') {
        // Se for cartão, o campo de parcelas é obrigatório e deve ser no mínimo 1.
        totalInstallmentsControl?.setValidators([Validators.required, Validators.min(1)]);
        // E o campo recorrente não é obrigatório.
        isRecurringControl?.clearValidators();
      }
      // Atualiza a validade dos controlos.
      isRecurringControl?.updateValueAndValidity();
      totalInstallmentsControl?.updateValueAndValidity();
    });

    // Dispara a verificação inicial
    typeControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.transactionForm.getRawValue(); // Usa getRawValue() para obter valores de campos desabilitados (como o 'type' em modo de edição)

    // Decide qual método de serviço chamar com base no tipo e no modo (edição/criação)
    let submissionObservable: Observable<Transaction>;

    if (this.isEditMode && this.transactionId) {
      submissionObservable = this.transactionService.updateConsumptionTransaction(this.transactionId, formData);
    } else {
      if (formData.type === 'CONSUMPTION') {
        submissionObservable = this.transactionService.createConsumptionTransaction(formData);
      } else {
        submissionObservable = this.transactionService.createCreditCardTransaction(formData);
      }
    }

    submissionObservable.subscribe({
      next: () => this.handleSuccess(),
      error: (err) => this.handleError(err)
    });
  }

  private handleSuccess(): void {
    this.isLoading = false;
    this.formSaved.emit();
    this.onClose();
  }

  private handleError(error: any): void {
    this.isLoading = false;
    this.errorMessage = 'Ocorreu um erro ao salvar a transação. Tente novamente.';
    console.error(error);
  }

  onClose(): void {
    this.closeModal.emit();
  }
}

