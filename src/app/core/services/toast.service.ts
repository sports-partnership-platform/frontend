import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  show(toast: Omit<Toast, 'id' | 'timestamp'>) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      timestamp: new Date(),
      duration: toast.duration || 4000
    };

    const current = this.toastsSubject.getValue();
    this.toastsSubject.next([...current, newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, newToast.duration);
    }
  }

  success(title: string, message: string, duration = 4000) {
    this.show({ type: 'success', title, message, duration });
  }

  error(title: string, message: string, duration = 5000) {
    this.show({ type: 'error', title, message, duration });
  }

  warning(title: string, message: string, duration = 4500) {
    this.show({ type: 'warning', title, message, duration });
  }

  info(title: string, message: string, duration = 3500) {
    this.show({ type: 'info', title, message, duration });
  }

  dismiss(id: string) {
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next(current.filter(t => t.id !== id));
  }
}
