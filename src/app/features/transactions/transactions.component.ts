import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Partner } from '../../core/models/partner.model';
import { Sport } from '../../core/models/sport.model';
import { Transaction } from '../../core/models/transaction.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.component.html'
})
export class TransactionsComponent implements OnInit {
  partners: Partner[] = [];
  sports: Sport[] = [];
  transactions: Transaction[] = [];
  loading = true;

  // Form State
  selectedPartnerId = '';
  selectedSport = 'cricket';
  amount: number = 10000;
  note = '';

  // Calculation Result
  previewResult: any = null;
  calculating = false;
  submitting = false;

  // Selected Transaction Modal
  selectedTxDetail: Transaction | null = null;
  showTxModal = false;

  constructor(
    private apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.apiService.getPartners().subscribe({
      next: (res) => {
        if (res.success) {
          this.partners = res.data;
          if (this.partners.length > 0) {
            // Select Raj Singh (L3) by default if available, or first partner
            const raj = this.partners.find(p => p.partnerId === 'P-10078') || this.partners[0];
            this.selectedPartnerId = raj._id;
            this.calculate();
          }
        }
      }
    });

    this.apiService.getSports().subscribe({
      next: (res) => {
        if (res.success) {
          this.sports = res.data;
        }
      }
    });

    this.loadTransactions();
  }

  loadTransactions(): void {
    this.apiService.getTransactions().subscribe({
      next: (res) => {
        if (res.success) {
          this.transactions = res.data;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  setScenario(sport: string, amount: number, note: string): void {
    if (this.partners.length > 0) {
      if (!this.selectedPartnerId) {
        this.selectedPartnerId = this.partners[0]._id;
      }
      this.selectedSport = sport;
      this.amount = amount;
      this.note = note;
      this.calculate();
      this.toastService.info('Preset Loaded', `Loaded scenario: ${note} (₹${amount.toLocaleString()})`);
    }
  }

  calculate(): void {
    if (!this.selectedPartnerId || !this.amount || this.amount <= 0) return;
    this.calculating = true;

    this.apiService.calculatePayout({
      partnerId: this.selectedPartnerId,
      sport: this.selectedSport,
      amount: this.amount
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.previewResult = res.data;
        }
        this.calculating = false;
      },
      error: (err) => {
        console.error(err);
        this.calculating = false;
      }
    });
  }

  processTransaction(): void {
    if (!this.selectedPartnerId || !this.amount || this.amount <= 0) {
      this.toastService.error('Validation Error', 'Please select a partner and enter a valid positive amount');
      return;
    }

    this.submitting = true;

    this.apiService.createTransaction({
      partnerId: this.selectedPartnerId,
      sport: this.selectedSport,
      amount: this.amount,
      note: this.note
    }).subscribe({
      next: (res) => {
        this.submitting = false;
        if (res.success) {
          this.toastService.success(
            'Transaction Settled',
            `Transaction ${res.data.transactionId} for ₹${this.amount.toLocaleString()} successfully distributed up to Owner`
          );
          this.note = '';
          this.loadTransactions();
        }
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Transaction Failed', err?.error?.message || 'Could not record transaction');
        this.submitting = false;
      }
    });
  }

  openTxModal(tx: Transaction): void {
    this.selectedTxDetail = tx;
    this.showTxModal = true;
  }

  closeTxModal(): void {
    this.showTxModal = false;
    this.selectedTxDetail = null;
  }
}
