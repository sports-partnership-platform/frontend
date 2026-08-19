import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  showPassword = false;
  loading = false;
  errorMessage = '';
  returnUrl = '/dashboard';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  quickFill(user: string, pass: string): void {
    this.username = user;
    this.password = pass;
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (!this.username.trim() || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.toastService.success(
            'Authentication Successful',
            `Welcome back, ${res.user.name || res.user.username} (${res.user.roleTitle || 'Partner'})`
          );
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Invalid username or password. Please try again.';
      }
    });
  }
}
