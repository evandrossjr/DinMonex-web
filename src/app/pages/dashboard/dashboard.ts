import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../model/transaction.model';
import { Installment } from '../../model/installment.model';
import { TransactionService } from '../../services/transaction';
import { DebtService } from '../../services/debt';
import { TransactionFormComponent } from '../../components/transaction-form/transaction-form';
import { InstallmentListComponent } from '../../components/installment-list/installment-list';
import { AuthService } from '../../services/auth';
import { forkJoin, map } from 'rxjs';
import { SharedDebt } from '../../model/sharedDebt.model';
import { HeaderComponent } from '../../components/header/header';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  // 2. Adiciona o RouterLink ao array de imports.
  imports: [HeaderComponent,CommonModule, TransactionFormComponent, InstallmentListComponent],
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
  selectedTransactionInstallments: Installment[] = [];

  constructor(
    private transactionService: TransactionService,
    private debtService: DebtService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      transactions: this.transactionService.getAllMyTransactions(),
      createdDebts: this.debtService.getMyCreatedDebts(),
      sharedDebts: this.debtService.getDebtsSharedWithMe()
    }).pipe(
      map(({ transactions, createdDebts, sharedDebts }) => {
        const createdDebtItems = createdDebts.map(debt => this.mapSharedDebtToDisplayItem(debt, 'CREATED'));
        const sharedDebtItems = sharedDebts.map(debt => this.mapSharedDebtToDisplayItem(debt, 'SHARED'));
        return [...transactions, ...createdDebtItems, ...sharedDebtItems];
      })
    ).subscribe({
      next: (combinedData) => {
        this.displayItems = combinedData.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
        this.isLoading = false;
      },
      error: (err) => {
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
  
  openInstallmentModal(transaction: Transaction): void {
    if (transaction.installments && transaction.installments.length > 0) {
      this.selectedTransactionInstallments = transaction.installments;
      this.isInstallmentModalVisible = true;
    }
  }

  onCloseInstallmentModal(): void {
    this.isInstallmentModalVisible = false;
    this.selectedTransactionInstallments = [];
  }

  logout(): void {
    this.authService.logout();
  }
}

