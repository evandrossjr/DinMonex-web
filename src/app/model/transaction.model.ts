/**
 * Interface que define a estrutura de um objeto de Transação no frontend.
 * Isto garante a segurança de tipos e ajuda a IDE com o autocompletar.
 */
export interface Transaction {
  id: number;
  description: string;
  value: number;
  dueDate: string; // As datas vêm como strings da API JSON
  isRecurring: boolean;
}