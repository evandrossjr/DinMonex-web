import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { Transaction } from '../../model/transaction.model';
import { TransactionService } from '../../services/transaction';
import { DebtService } from '../../services/debt';
import { TransactionFormComponent } from '../../components/transaction-form/transaction-form';
import { AuthService } from '../../services/auth';
import { forkJoin, map } from 'rxjs';
import { SharedDebt } from '../../model/sharedDebt.model';
import { HeaderComponent } from '../../components/header/header';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent,CommonModule, TransactionFormComponent, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {

  displayItems: any[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  isTransactionModalVisible = false;
  selectedTransactionId: number | null = null;
  isInstallmentModalVisible = false;


  currentMonthFilter: string = new Date().toISOString().substring(0, 7);
  summaryData: {totalGeral: number, totalPago: number, totalPendente: number} = {totalGeral: 0, totalPago: 0, totalPendente: 0};

  constructor(
    private transactionService: TransactionService,
    private debtService: DebtService,
    private authService: AuthService
  ) { }

  toggleStatus(item: any, event: any): void {
    const novoStatus = event.target.checked ? 'PAID' : 'PENDING';

    const updateData = {
      ...item, // Copia os dados atuais
      status: novoStatus
    };

    // Chama o serviço de atualização (reutilizamos o endpoint de update)
    // Nota: O ideal seria ter um endpoint PATCH /pay, mas o PUT resolve por enquanto.
    this.transactionService.updateConsumptionTransaction(item.id, updateData).subscribe({
      next: () => {
        // Atualiza o item localmente para não precisar recarregar a tela toda
        item.status = novoStatus;
        // Recalcula os totais (ou recarrega tudo se preferir garantir a consistência)
        this.loadAllData(); 
      },
      error: (err) => {
        console.error('Erro ao atualizar status', err);
        // Desfaz a marcação visual se der erro no servidor
        event.target.checked = !event.target.checked;
      }
    });
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  onDateChange(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoading = true;
    this.error = null;

    const [yearStr, monthStr] = this.currentMonthFilter.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);

    forkJoin({
      transactions: this.transactionService.getAllMyTransactions(month, year),
      resume: this.transactionService.getResumeTransactions(month, year),
      //createdDebts: this.debtService.getMyCreatedDebts(),
      //sharedDebts: this.debtService.getDebtsSharedWithMe()
    }).pipe(
      map(({ transactions, resume/*, createdDebts, sharedDebts*/ }) => {
        //const createdDebtItems = createdDebts.map(debt => this.mapSharedDebtToDisplayItem(debt, 'CREATED'));
        //const sharedDebtItems = sharedDebts.map(debt => this.mapSharedDebtToDisplayItem(debt, 'SHARED'));
        this.summaryData = resume;
        
        return [...transactions /*...createdDebtItems, ...sharedDebtItems*/];
      })
    ).subscribe({
      next: (combinedData) => {
        this.displayItems = combinedData.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
        this.isLoading = false;
        console.log("Dados carregados:", combinedData);
      },
      error: (err) => {
        console.error("ERRO NO DASHBOARD", err);
        this.error = 'Não foi possível carregar os dados.';
        this.isLoading = false;
      }
    });
  }

  private mapSharedDebtToDisplayItem(debt: SharedDebt, perspective: 'CREATED' | 'SHARED'): any {
    return {
      id: debt.id,
      description: debt.description,
      value: debt.value,
      dueDate: debt.dueDate,
      type: 'DEBT',
      debtInfo: {
        perspective: perspective,
        otherPartyName: perspective === 'CREATED' ? debt.invitedUser.name : debt.createdBy.name,
        status: debt.status
      }
    };
  }

  openAddModal(): void {
    this.selectedTransactionId = null;
    this.isTransactionModalVisible = true;
  }

  openEditModal(id: number): void {
    this.selectedTransactionId = id;
    this.isTransactionModalVisible = true;
  }

  deleteTransaction(id: number): void {
    this.transactionService.deleteConsumptionTransaction(id).subscribe({
      next: () => this.loadAllData(),
      error: (err) => console.error(err)
    });
  }

  onCloseTransactionModal(): void {
    this.isTransactionModalVisible = false;
    this.selectedTransactionId = null;
  }

  onFormSaved(): void {
    this.loadAllData();
  }
  

  logout(): void {
    this.authService.logout();
  }
}

