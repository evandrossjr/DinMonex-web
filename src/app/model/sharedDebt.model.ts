import { UserSummary } from "./userSummary.model";

/**
 * Interface que define a estrutura de um objeto de Dívida Partilhada no frontend.
 * Corresponde ao SharedDebtResponseDTO do backend.
 */
export interface SharedDebt {
  id: number;
  description: string;
  value: number;
  dueDate: string; // Formato ISO 8601 (YYYY-MM-DD)
  status: 'PENDING' | 'ACCEPTED' | 'RECUSED';
  createdBy: UserSummary;
  invitedUser: UserSummary
}