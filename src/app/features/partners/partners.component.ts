import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Partner } from '../../core/models/partner.model';

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './partners.component.html'
})
export class PartnersComponent implements OnInit {
  partners: Partner[] = [];
  filteredPartners: Partner[] = [];
  loading = true;

  // Search & Filter
  searchTerm = '';
  selectedLevelFilter: string = 'ALL';

  // Add Partner Modal State
  showAddModal = false;
  newPartner = {
    name: '',
    email: '',
    phone: '',
    parentId: '',
    status: 'Active'
  };
  addPartnerError = '';

  // Partner Profile Drawer State
  selectedPartnerDetail: any = null;
  showDetailDrawer = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPartners();
  }

  loadPartners(): void {
    this.loading = true;
    this.apiService.getPartners().subscribe({
      next: (res) => {
        if (res.success) {
          this.partners = res.data;
          this.applyFilter();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    this.filteredPartners = this.partners.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            p.partnerId.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesLevel = this.selectedLevelFilter === 'ALL' || p.level === Number(this.selectedLevelFilter);
      return matchesSearch && matchesLevel;
    });
  }

  openAddModal(): void {
    const owner = this.partners.find(p => p.level === 0) || this.partners[0];
    this.newPartner = {
      name: '',
      email: '',
      phone: '',
      parentId: owner ? owner._id : '',
      status: 'Active'
    };
    this.addPartnerError = '';
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  savePartner(): void {
    if (!this.newPartner.name.trim()) {
      this.addPartnerError = 'Partner Name is required';
      return;
    }

    this.apiService.createPartner(this.newPartner).subscribe({
      next: (res) => {
        if (res.success) {
          this.closeAddModal();
          this.loadPartners();
        }
      },
      error: (err) => {
        this.addPartnerError = err.error?.message || 'Error creating partner';
      }
    });
  }

  openPartnerDetail(partner: Partner): void {
    this.apiService.getPartnerById(partner._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.selectedPartnerDetail = res.data;
          this.showDetailDrawer = true;
        }
      }
    });
  }

  closeDetailDrawer(): void {
    this.showDetailDrawer = false;
    this.selectedPartnerDetail = null;
  }

  // Get potential parent options (Level 0 Root Owner up to Level 4)
  get parentOptions(): Partner[] {
    return this.partners.filter(p => p.level >= 0 && p.level < 5);
  }

  getTargetRoleTitle(level: number): string {
    switch (level) {
      case 1: return '(Senior Partner)';
      case 2: return '(Sub-Partner)';
      case 3: return '(Master Agent)';
      case 4: return '(Agent)';
      case 5: return '(Sub-Agent)';
      default: return '';
    }
  }
}
