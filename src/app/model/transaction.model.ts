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

  type: 'CONSUMPTION' | 'CREDIT_CARD' | 'DEBT'; 


  totalInstallments?: number; // O '?' indica que a propriedade é opcional
  currentInstallment?: number;
  installments?: Installment[]; // Uma transação pode ter uma lista de parcelas
}