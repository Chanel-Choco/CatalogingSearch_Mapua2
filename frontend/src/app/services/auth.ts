import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // added this

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiUrl}/api/auth`;
  //private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  // ================= LOGIN =================
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, {
      email,
      password
    });
  }

  // ================= REGISTER =================
  register(name: string, email: string, password: string, role: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/register`,
      {
        name,
        email,
        password,
        role
      },
      {
        responseType: 'text' as 'json'
      }
    );
  }

  // ================= RESET PASSWORD =================
  resetPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/reset-password`,
      {
        email,
        newPassword
      },
      {
        responseType: 'text' as 'json'
      }
    );
  }
}