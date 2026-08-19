import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  stats: any = null;
  loading = true;

  // Quick Calculator State
  calcPartnerId: string = '';
  calcSport: string = 'cricket';
  calcAmount: number = 10000;
  calcResult: any = null;
  calcLoading = false;
  partnersList: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.apiService.getDashboardStats().subscribe({
      next: (res) => {
        if (res.success) {
          this.stats = res.data;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });

    this.apiService.getPartners().subscribe({
      next: (res) => {
        if (res.success) {
          this.partnersList = res.data;
          if (this.partnersList.length > 0) {
            // Select Raj Singh (L3) by default if found, else first partner
            const raj = this.partnersList.find(p => p.partnerId === 'P-10078') || this.partnersList[0];
            this.calcPartnerId = raj._id;
            this.runQuickCalculator();
          }
        }
      }
    });
  }

  runQuickCalculator(): void {
    if (!this.calcPartnerId || !this.calcAmount) return;
    this.calcLoading = true;
    this.apiService.calculatePayout({
      partnerId: this.calcPartnerId,
      sport: this.calcSport,
      amount: this.calcAmount
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.calcResult = res.data;
        }
        this.calcLoading = false;
      },
      error: () => {
        this.calcLoading = false;
      }
    });
  }
}
