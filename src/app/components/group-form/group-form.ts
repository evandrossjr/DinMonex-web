import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../../services/transaction';

@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './group-form.html',
  styleUrls: ['./group-form.scss']
})
export class GroupFormComponent {

  @Output() closeModal = new EventEmitter<void>();
  @Output() groupSaved = new EventEmitter<void>();

  groupForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService
  ) {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      // Define uma cor padrão inicial (azul bonito)
      hexColor: ['#3b82f6', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.groupForm.invalid) return;

    this.isLoading = true;
    const formData = this.groupForm.value;

    this.transactionService.createGroupTransaction(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        // Avisa quem chamou que salvou com sucesso
        this.groupSaved.emit(); 
        this.closeModal.emit();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        alert('Erro ao criar categoria.');
      }
    });
  }

  onCancel() {
    this.closeModal.emit();
  }
}
