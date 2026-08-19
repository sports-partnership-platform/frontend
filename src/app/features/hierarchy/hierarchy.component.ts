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
}
