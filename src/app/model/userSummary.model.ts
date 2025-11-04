/**
 * Interface que define um resumo de um utilizador, para ser usada dentro de outros modelos.
 * Evita a exposição de dados sensíveis como e-mail ou senha.
 */
export interface UserSummary {
  id: number;
  name: string;
}