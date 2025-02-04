import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appliance {
    id?: number;
    name: string;
    power: number;
    hours_per_day: number;
    days_per_month: number;
    user_id?: number;
  }

@Injectable({
  providedIn: 'root'
})
export class ApplianceService {
  private apiUrl = 'http://localhost:3000/appliances';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getAppliances(headers: HttpHeaders): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  addAppliance(appliance: any): Observable<any> {
    const token = localStorage.getItem('token');
  
    if (!token) {
      throw new Error('Token não encontrado');
    }
  
    const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica o token
    const userId = payload.id; // Pega o ID do usuário do token
  
    const applianceData = { ...appliance, user_id: userId }; // Adiciona o user_id
  
    return this.http.post(`${this.apiUrl}`, applianceData, this.getHeaders());
  }
  

  updateAppliance(id: number, appliance: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, appliance, this.getHeaders());
  }

  deleteAppliance(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }
}
