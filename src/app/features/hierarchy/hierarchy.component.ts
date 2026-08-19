import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Partner } from '../../core/models/partner.model';

@Component({
  selector: 'app-hierarchy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hierarchy.component.html'
})
export class HierarchyComponent implements OnInit {
  treeNodes: Partner[] = [];
  loading = true;
  selectedNode: any = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadTree();
  }

  loadTree(): void {
    this.loading = true;
    this.apiService.getPartnerTree().subscribe({
      next: (res) => {
        if (res.success) {
          this.treeNodes = res.data;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  selectNode(node: Partner): void {
    this.selectedNode = node;
  }

  closeNodeDetail(): void {
    this.selectedNode = null;
  }

  getNodeCardClass(level: number): string {
    switch (level) {
      case 0:
        return 'p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-[#131927] to-[#0d1322] border border-amber-500/50 hover:border-amber-400 shadow-lg shadow-amber-950/30';
      case 1:
        return 'bg-[#0f172a] border border-amber-500/30 hover:border-amber-400';
      case 2:
        return 'bg-[#0e1628] border border-sky-500/30 hover:border-sky-400';
      case 3:
        return 'bg-[#0c1322] border border-emerald-500/30 hover:border-emerald-400';
      case 4:
        return 'bg-[#0b101c] border border-purple-500/30 hover:border-purple-400';
      case 5:
        return 'bg-[#090d17] border border-rose-500/30 hover:border-rose-400';
      default:
        return 'bg-[#0e1628] border border-white/10 hover:border-white/30';
    }
  }

  getIconBoxClass(level: number): string {
    switch (level) {
      case 1: return 'bg-amber-500/10 border border-amber-500/30 text-amber-400';
      case 2: return 'bg-sky-500/10 border border-sky-500/30 text-sky-400';
      case 3: return 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400';
      case 4: return 'bg-purple-500/10 border border-purple-500/30 text-purple-400';
      case 5: return 'bg-rose-500/10 border border-rose-500/30 text-rose-400';
      default: return 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-400';
    }
  }

  getBadgeClass(level: number): string {
    switch (level) {
      case 0: return 'badge-l0 font-extrabold';
      case 1: return 'badge-l1 font-bold';
      case 2: return 'badge-l2 font-semibold';
      case 3: return 'badge-l3 font-semibold';
      case 4: return 'badge-l4 font-bold';
      case 5: return 'badge-l5 font-bold';
      default: return 'badge-l1 font-bold';
    }
  }

  getSubtitleClass(level: number): string {
    switch (level) {
      case 0: return 'text-amber-300/80';
      case 1: return 'text-amber-400/80';
      case 2: return 'text-sky-400/80';
      case 3: return 'text-emerald-400/80';
      case 4: return 'text-purple-400/80';
      case 5: return 'text-rose-400/80';
      default: return 'text-slate-400';
    }
  }

  getBranchBorderClass(level: number): string {
    switch (level) {
      case 0: return 'border-amber-500/30';
      case 1: return 'border-sky-500/30';
      case 2: return 'border-emerald-500/30';
      case 3: return 'border-purple-500/30';
      case 4: return 'border-rose-500/30';
      default: return 'border-slate-500/30';
    }
  }

  getRoleLabel(node: any): string {
    if (node.level === 0) return 'PLATFORM OWNER';
    if (node.roleTitle) return `Level ${node.level} (${node.roleTitle})`;
    const roles: Record<number, string> = {
      1: 'Level 1 (Senior Partner)',
      2: 'Level 2 (Sub-Partner)',
      3: 'Level 3 (Master Agent)',
      4: 'Level 4 (Agent)',
      5: 'Level 5 (Sub-Agent)'
    };
    return roles[node.level] || `Level ${node.level}`;
  }
}
