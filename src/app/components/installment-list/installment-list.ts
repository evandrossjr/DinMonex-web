import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Installment } from '../../model/installment.model';

@Component({
  selector: 'app-installment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './installment-list.html',
  styleUrl: './installment-list.scss'
})
export class InstallmentListComponent {

  // @Input() permite que o Dashboard nos envie a lista de parcelas a serem exibidas.
  @Input() installments: Installment[] = [];
  
  // @Output() permite-nos enviar um evento para o Dashboard para fechar o modal.
  @Output() closeModal = new EventEmitter<void>();

  constructor() { }

  // Método para emitir o evento de fecho.
  onClose(): void {
    this.closeModal.emit();
  }
}