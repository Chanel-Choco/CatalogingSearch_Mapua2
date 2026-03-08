// ================= ANGULAR CORE =================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { environment } from '../../environments/environment'; //added this

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './account.html',
  styleUrls: ['./account.css']
})
export class AccountComponent implements OnInit {

  user: any = null;
  loading: boolean = true;

  showChangePassword: boolean = false;

  newPassword: string = '';
  confirmPassword: string = '';

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

    const userId = localStorage.getItem('userId');

    if (!userId) {
      this.loading = false;
      this.errorMessage = "User not found. Please login again.";
      return;
    }
    
    this.http.get(`${environment.apiUrl}/api/users/${userId}`)
    //this.http.get(`http://localhost:8080/api/users/${userId}`)
      .subscribe({
        next: (data) => {
          this.user = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMessage = "Failed to load account information.";
        }
      });
  }

  toggleChangePassword(): void {
    this.showChangePassword = !this.showChangePassword;

    if (!this.showChangePassword) {
      this.resetPasswordFields();
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  resetPasswordFields(): void {
    this.newPassword = '';
    this.confirmPassword = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.showPassword = false;
    this.showConfirmPassword = false;
  }

  // ================= PASSWORD RULES =================

  hasMinLength(): boolean {
    return this.newPassword.length >= 12;
  }

  hasUppercase(): boolean {
    return /[A-Z]/.test(this.newPassword);
  }

  hasLowercase(): boolean {
    return /[a-z]/.test(this.newPassword);
  }

  hasNumber(): boolean {
    return /\d/.test(this.newPassword);
  }

  hasSymbol(): boolean {
    return /[\W_]/.test(this.newPassword);
  }

  passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword;
  }

  isPasswordValid(): boolean {
    return this.hasMinLength()
      && this.hasUppercase()
      && this.hasLowercase()
      && this.hasNumber()
      && this.hasSymbol();
  }

  // ================= UPDATE PASSWORD =================

  updatePassword(): void {

    this.errorMessage = '';
    this.successMessage = '';

    const userId = localStorage.getItem('userId');

    if (!userId) {
      this.errorMessage = "User ID missing. Please login again.";
      return;
    }

    if (!this.isPasswordValid()) {
      this.errorMessage =
        "Password does not meet security requirements.";
      return;
    }

    if (!this.passwordsMatch()) {
      this.errorMessage = "Passwords do not match.";
      return;
    }

    this.http.put(
      `${environment.apiUrl}/api/users/${userId}/password`,
      //`http://localhost:8080/api/users/${userId}/password`,
      { password: this.newPassword },
      { responseType: 'text' }   // IMPORTANT FIX
    ).subscribe({
      next: (response: string) => {

        this.successMessage = response;

        this.resetPasswordFields();

        // Auto close password form after success
        this.showChangePassword = false;
      },
      error: () => {
        this.errorMessage = "Failed to update password.";
      }
    });
  }
}