import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from './core/services/toast.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Sports Partnership Platform';
  mobileMenuOpen = false;

  constructor(
    public toastService: ToastService,
    public authService: AuthService
  ) {}

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  dismissToast(id: string): void {
    this.toastService.dismiss(id);
  }

  logout(): void {
    this.closeMobileMenu();
    this.authService.logout();
    this.toastService.info('Signed Out', 'You have been safely signed out of your account');
  }
}
