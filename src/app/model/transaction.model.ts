import { Inject, Injectable } from "@angular/core";
import { Installment } from "./installment.model";


/**
 * Interface que define a estrutura de um objeto de Transação no frontend.
 * Isto garante a segurança de tipos e ajuda a IDE com o autocompletar.
 */
export interface Transaction {
  id: number;
  description: string;
  value: number;
  dueDate: string; 
  isRecurring: boolean;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  type: 'CONSUMPTION' | 'CREDIT_CARD' | 'DEBT'; 

  groupId?: number;
  groupName?: string;
  groupColor?: string;


  totalInstallments?: number; // O
  currentInstallment?: number;
  
}


