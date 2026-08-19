import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
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

  constructor(private apiService: ApiService) {}

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
    if (!this.selectedPartnerId || !this.amount || this.amount <= 0) return;
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
          this.note = '';
          this.loadTransactions();
        }
      },
      error: (err) => {
        console.error(err);
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
