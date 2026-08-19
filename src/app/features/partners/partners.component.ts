import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
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
    username: '',
    password: '',
    status: 'Active'
  };
  addPartnerError = '';
  saving = false;

  // Created / Reset Credentials Confirmation Modal
  showCredentialsModal = false;
  credentialsModalTitle = 'Partner Onboarded Successfully';
  credentialsModalSubtitle = 'Portal access has been provisioned';
  copied = false;
  resettingPartnerId: string | null = null;
  createdCredentials: {
    partnerName: string;
    partnerId: string;
    level: number;
    roleTitle: string;
    username: string;
    temporaryPassword: string;
  } | null = null;

  // Partner Profile Drawer State
  selectedPartnerDetail: any = null;
  showDetailDrawer = false;

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private toastService: ToastService
  ) {}

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
    if (!this.authService.canCreateDownlines()) {
      this.toastService.error('Hierarchy Cap', 'Level 5 Sub-Agents cannot create further downline partners');
      return;
    }

    const currentUser = this.authService.getUser();
    const isOwner = this.authService.isOwner();

    // If Owner, default parentId to Owner partner
    // If non-owner, lock parentId to current user's partnerRef
    let defaultParentId = '';
    if (isOwner) {
      const owner = this.partners.find(p => p.level === 0) || this.partners[0];
      defaultParentId = owner ? owner._id : '';
    } else if (currentUser) {
      defaultParentId = typeof currentUser.partnerRef === 'object' ? (currentUser.partnerRef as any)?._id : currentUser.partnerRef;
    }

    this.newPartner = {
      name: '',
      email: '',
      phone: '',
      parentId: defaultParentId,
      username: '',
      password: this.generateRandomPassword(),
      status: 'Active'
    };
    this.addPartnerError = '';
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  generateRandomPassword(): string {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `pass@${result}`;
  }

  onNameInput(): void {
    if (this.newPartner.name && !this.newPartner.username) {
      const base = this.newPartner.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
      this.newPartner.username = base;
    }
  }

  savePartner(): void {
    if (!this.newPartner.name.trim()) {
      this.addPartnerError = 'Partner Name is required';
      return;
    }

    this.saving = true;
    this.addPartnerError = '';

    this.apiService.createPartner(this.newPartner).subscribe({
      next: (res: any) => {
        this.saving = false;
        if (res.success) {
          this.closeAddModal();
          this.loadPartners();

          // Show Credentials confirmation modal
          this.credentialsModalTitle = 'Partner Onboarded Successfully';
          this.credentialsModalSubtitle = 'Portal access has been provisioned';
          this.copied = false;
          this.createdCredentials = {
            partnerName: res.data.name,
            partnerId: res.data.partnerId,
            level: res.data.level,
            roleTitle: res.data.roleTitle,
            username: res.credentials?.username || this.newPartner.username,
            temporaryPassword: res.credentials?.temporaryPassword || this.newPartner.password
          };
          this.showCredentialsModal = true;

          this.toastService.success(
            'Partner Onboarded',
            `${res.data.name} provisioned as ${res.data.roleTitle} (${res.data.partnerId})`
          );
        }
      },
      error: (err) => {
        this.saving = false;
        this.addPartnerError = err.error?.message || 'Error creating partner';
      }
    });
  }

  resetPassword(partner: Partner): void {
    if (!confirm(`Are you sure you want to generate a new password for ${partner.name} (${partner.partnerId})?`)) {
      return;
    }

    this.resettingPartnerId = partner._id;
    this.apiService.resetPartnerPassword(partner._id).subscribe({
      next: (res: any) => {
        this.resettingPartnerId = null;
        if (res.success) {
          this.credentialsModalTitle = 'Credentials Reset Successfully';
          this.credentialsModalSubtitle = 'A new temporary password has been generated';
          this.copied = false;
          this.createdCredentials = {
            partnerName: res.credentials.partnerName,
            partnerId: res.credentials.partnerId,
            level: res.credentials.level,
            roleTitle: res.credentials.roleTitle,
            username: res.credentials.username,
            temporaryPassword: res.credentials.temporaryPassword
          };
          this.showCredentialsModal = true;
          this.toastService.success(
            'Password Reset',
            `New credentials generated for ${partner.name}`
          );
        }
      },
      error: (err) => {
        this.resettingPartnerId = null;
        this.toastService.error('Reset Failed', err.error?.message || 'Could not reset password');
      }
    });
  }

  copyCredentials(): void {
    if (!this.createdCredentials) return;
    const text = `Sports Platform Credentials\n--------------------------\nPartner: ${this.createdCredentials.partnerName} (${this.createdCredentials.partnerId})\nRole: ${this.createdCredentials.roleTitle}\nUsername: ${this.createdCredentials.username}\nPassword: ${this.createdCredentials.temporaryPassword}`;
    navigator.clipboard.writeText(text).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2500);
    });
  }

  closeCredentialsModal(): void {
    this.showCredentialsModal = false;
    this.createdCredentials = null;
    this.copied = false;
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
