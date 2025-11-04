/**
 * Interface que define a estrutura de um objeto de Parcela (Installment) no frontend.
 */
export interface Installment {
  id: number;
  installmentNumber: number;
  value: number;
  dueDate: string;
  isPaid: boolean;
}
