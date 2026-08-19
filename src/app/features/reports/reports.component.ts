import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {
  partnerEarnings: any[] = [];
  loading = true;

  levelEarnings: { [key: string]: number } = { L0: 0, L1: 0, L2: 0, L3: 0, L4: 0, L5: 0 };
  sportEarnings: { [key: string]: number } = {};

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadEarningsReport();
  }

  loadEarningsReport(): void {
    this.loading = true;
    this.apiService.getEarningsReport().subscribe({
      next: (res) => {
        if (res.success) {
          this.partnerEarnings = res.data;
          this.calculateSummaries();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  calculateSummaries(): void {
    this.levelEarnings = { L0: 0, L1: 0, L2: 0, L3: 0, L4: 0, L5: 0 };
    this.sportEarnings = {};

    this.partnerEarnings.forEach(p => {
      const levelKey = `L${p.level}`;
      if (this.levelEarnings[levelKey] !== undefined) {
        this.levelEarnings[levelKey] += p.totalEarnings;
      }

      if (p.sportsBreakdown) {
        Object.keys(p.sportsBreakdown).forEach(sportKey => {
          if (!this.sportEarnings[sportKey]) {
            this.sportEarnings[sportKey] = 0;
          }
          this.sportEarnings[sportKey] += p.sportsBreakdown[sportKey];
        });
      }
    });
  }
}
