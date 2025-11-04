import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../model/transaction.model';
import { TransactionService } from '../../services/transaction';
import { DebtService } from '../../services/debt';
import { Observable } from 'rxjs'; 
import { SharedDebt } from '../../model/sharedDebt.model';


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

  transactionTypes = ['CONSUMPTION', 'CREDIT_CARD', 'DEBT'];

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private debtService: DebtService
  ) {
    this.transactionForm = this.fb.group({
      type: ['CONSUMPTION', [Validators.required]], 
      description: ['', [Validators.required]],
      value: [null, [Validators.required, Validators.min(0.01)]],
      dueDate: ['', [Validators.required]],
      isRecurring: [false],
      totalInstallments: [1, [Validators.min(1)]],
      invitedUserEmail: ['', [Validators.email]] 
    });
  }

  ngOnInit(): void {
    this.setupConditionalValidators();

    if (this.transactionId !== null) {
      this.isEditMode = true;
      this.isLoading = true;
      this.transactionForm.get('type')?.disable(); 
      
      this.transactionService.getConsumptionTransactionById(this.transactionId).subscribe({
        next: (transaction) => {
          this.transactionForm.patchValue(transaction);
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Não foi possível carregar os dados da transação.';
          this.isLoading = false;
        }
      });
    }
  }

  private setupConditionalValidators(): void {
    const typeControl = this.transactionForm.get('type');
    const isRecurringControl = this.transactionForm.get('isRecurring');
    const totalInstallmentsControl = this.transactionForm.get('totalInstallments');
    const invitedUserEmailControl = this.transactionForm.get('invitedUserEmail');

    typeControl?.valueChanges.subscribe(type => {
      isRecurringControl?.clearValidators();
      totalInstallmentsControl?.clearValidators();
      invitedUserEmailControl?.clearValidators();

      if (type === 'CONSUMPTION') {
        isRecurringControl?.setValidators([Validators.required]);
      } else if (type === 'CREDIT_CARD') {
        totalInstallmentsControl?.setValidators([Validators.required, Validators.min(1)]);
      } else if (type === 'DEBT') {
        invitedUserEmailControl?.setValidators([Validators.required, Validators.email]);
      }

      isRecurringControl?.updateValueAndValidity();
      totalInstallmentsControl?.updateValueAndValidity();
      invitedUserEmailControl?.updateValueAndValidity();
    });

    typeControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.transactionForm.getRawValue();

    // A SOLUÇÃO: Tipamos a variável explicitamente para que o TypeScript a entenda.
    let submissionObservable: Observable<Transaction | SharedDebt>;

    if (this.isEditMode && this.transactionId) {
      submissionObservable = this.transactionService.updateConsumptionTransaction(this.transactionId, formData);
    } else {
      switch (formData.type) {
        case 'CONSUMPTION':
          submissionObservable = this.transactionService.createConsumptionTransaction(formData);
          break;
        case 'CREDIT_CARD':
          submissionObservable = this.transactionService.createCreditCardTransaction(formData);
          break;
        case 'DEBT':
          submissionObservable = this.debtService.createSharedDebt(formData);
          break;
        default:
          this.handleError(new Error('Tipo de transação desconhecido'));
          return;
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
    this.errorMessage = 'Ocorreu um erro ao salvar. Por favor, verifique os dados e tente novamente.';
    console.error(error);
  }

  onClose(): void {
    this.closeModal.emit();
  }
}

