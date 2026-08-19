import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Partner } from '../models/partner.model';
import { Sport } from '../models/sport.model';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // --- Partners ---
  getPartners(): Observable<{ success: boolean; data: Partner[] }> {
    return this.http.get<{ success: boolean; data: Partner[] }>(`${this.baseUrl}/partners`);
  }

  getPartnerTree(): Observable<{ success: boolean; data: Partner[] }> {
    return this.http.get<{ success: boolean; data: Partner[] }>(`${this.baseUrl}/partners/tree`);
  }

  getPartnerById(id: string): Observable<{ success: boolean; data: { partner: Partner; downlines: Partner[] } }> {
    return this.http.get<{ success: boolean; data: { partner: Partner; downlines: Partner[] } }>(`${this.baseUrl}/partners/${id}`);
  }

  createPartner(payload: any): Observable<{ success: boolean; data: Partner }> {
    return this.http.post<{ success: boolean; data: Partner }>(`${this.baseUrl}/partners`, payload);
  }

  updatePartner(id: string, payload: any): Observable<{ success: boolean; data: Partner }> {
    return this.http.put<{ success: boolean; data: Partner }>(`${this.baseUrl}/partners/${id}`, payload);
  }

  deletePartner(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.baseUrl}/partners/${id}`);
  }

  // --- Partnerships ---
  getPartnershipMatrix(): Observable<{ success: boolean; data: { sports: Sport[]; matrix: any[] } }> {
    return this.http.get<{ success: boolean; data: { sports: Sport[]; matrix: any[] } }>(`${this.baseUrl}/partnerships/matrix`);
  }

  updatePartnership(payload: { partnerId: string; sportCode: string; given: number }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/partnerships/update`, payload);
  }

  // --- Sports ---
  getSports(): Observable<{ success: boolean; data: Sport[] }> {
    return this.http.get<{ success: boolean; data: Sport[] }>(`${this.baseUrl}/sports`);
  }

  // --- Transactions & Calculator ---
  calculatePayout(payload: { partnerId: string; sport: string; amount: number }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/transactions/calculate`, payload);
  }

  createTransaction(payload: { partnerId: string; sport: string; amount: number; note?: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/transactions`, payload);
  }

  getTransactions(params?: any): Observable<{ success: boolean; data: Transaction[] }> {
    return this.http.get<{ success: boolean; data: Transaction[] }>(`${this.baseUrl}/transactions`, { params });
  }

  // --- Reports & Dashboard ---
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/reports/dashboard`);
  }

  getEarningsReport(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/reports/earnings`);
  }
}
