import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Sport } from '../../core/models/sport.model';

@Component({
  selector: 'app-partnership',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './partnership.component.html'
})
export class PartnershipComponent implements OnInit {
  sports: Sport[] = [];
  matrix: any[] = [];
  loading = true;
  selectedSportTab = 'cricket';

  // Edit partnership modal state
  showEditModal = false;
  editingPartner: any = null;
  editingSportCode = 'cricket';
  editingGiven = 0;
  editingReceived = 0;
  editingRemaining = 0;
  saveError = '';
  saving = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadMatrix();
  }

  loadMatrix(): void {
    this.loading = true;
    this.apiService.getPartnershipMatrix().subscribe({
      next: (res) => {
        if (res.success) {
          this.sports = res.data.sports;
          this.matrix = res.data.matrix;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  openEditModal(partner: any, sportCode: string): void {
    this.editingPartner = partner;
    this.editingSportCode = sportCode;
    const config = partner.sportsWise[sportCode] || { received: 0, given: 0, remaining: 0 };
    this.editingReceived = config.received;
    this.editingGiven = config.given;
    this.editingRemaining = config.remaining;
    this.saveError = '';
    this.showEditModal = true;
  }

  onGivenChange(): void {
    if (this.editingGiven === null || this.editingGiven === undefined || (this.editingGiven as any) === '') {
      this.editingRemaining = this.editingReceived;
      return;
    }
    let val = Number(this.editingGiven);
    if (isNaN(val)) {
      this.editingRemaining = this.editingReceived;
      return;
    }
    if (val < 0) {
      val = 0;
      this.editingGiven = 0;
    } else if (val > this.editingReceived) {
      val = this.editingReceived;
      this.editingGiven = this.editingReceived;
    }
    this.editingRemaining = Math.max(0, Math.round((this.editingReceived - val) * 100) / 100);
  }

  onGivenBlur(): void {
    if (this.editingGiven === null || this.editingGiven === undefined || (this.editingGiven as any) === '' || isNaN(Number(this.editingGiven))) {
      this.editingGiven = 0;
    } else if (this.editingGiven < 0) {
      this.editingGiven = 0;
    } else if (this.editingGiven > this.editingReceived) {
      this.editingGiven = this.editingReceived;
    }
    this.onGivenChange();
  }

  savePartnership(): void {
    if (!this.editingPartner) return;
    this.onGivenBlur();
    this.saving = true;
    this.saveError = '';

    this.apiService.updatePartnership({
      partnerId: this.editingPartner._id,
      sportCode: this.editingSportCode,
      given: this.editingGiven
    }).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.closeEditModal();
          this.loadMatrix();
        }
      },
      error: (err) => {
        this.saving = false;
        this.saveError = err.error?.message || 'Failed to update partnership';
      }
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingPartner = null;
  }
}
