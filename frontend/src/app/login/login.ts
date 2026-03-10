// ================= ANGULAR CORE =================
import { Component } from '@angular/core';

// Enables structural directives (*ngIf) and common Angular features
import { CommonModule } from '@angular/common';

// Required for ngModel (two-way data binding in form inputs)
import { FormsModule } from '@angular/forms';

// Router allows navigation between pages
import { Router } from '@angular/router';

// Custom authentication service
import { AuthService } from '../services/auth';

import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';



/**
 * LoginComponent
 * --------------
 * Handles user authentication.
 *
 * Responsibilities:
 * - Capture user credentials (email & password)
 * - Send authentication request to backend
 * - Store authenticated user data in localStorage
 * - Redirect user to Home page upon success
 * - Display error message if authentication fails
 * - Navigate to Reset Password page
 * - Navigate to Register page
 * 
 * Added
 * - Checks backend/database connectivity on load
 * - Shows spinner while logging in
 * - Toast notification for server status
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})

export class LoginComponent implements OnInit {

  // ================= FORM FIELDS =================
  email: string = '';
  password: string = '';

  // ================= UI STATES =================
  errorMessage: string = '';
  showPassword: boolean = false;
  isLoggingIn: boolean = false;

  // ================= SERVER STATUS =================
  // 'checking' | 'online' | 'offline' | 'waking'
  serverStatus: 'checking' | 'online' | 'offline' | 'waking' = 'checking';
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'info' | 'success' | 'error' | 'warning' = 'info';

  private checkStartTime: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.checkBackendStatus();
  }

  // ================= BACKEND STATUS CHECK =================
  checkBackendStatus(): void {
    this.serverStatus = 'checking';
    this.checkStartTime = Date.now();
    this.showToastMessage('Connecting to server...', 'info', false);

    // First quick ping — if it takes more than 3s, show "waking up" message
    const wakingTimer = setTimeout(() => {
      if (this.serverStatus === 'checking') {
        this.serverStatus = 'waking';
        this.showToastMessage('Server is waking up, please wait...', 'warning', false);
      }
    }, 3000);

    this.http.get(`${environment.apiUrl}/actuator/health`, { responseType: 'text' })
      .subscribe({
        next: () => {
          clearTimeout(wakingTimer);
          this.serverStatus = 'online';
          const elapsed = Date.now() - this.checkStartTime;
          const msg = elapsed > 3000
            ? 'Server is awake and ready!'
            : 'Connected successfully!';
          this.showToastMessage(msg, 'success', true);
        },
        error: () => {
          clearTimeout(wakingTimer);
          this.serverStatus = 'offline';
          this.showToastMessage('Cannot reach server. Please try again later.', 'error', false);
        }
      });
  }

  // ================= TOAST HELPER =================
  showToastMessage(message: string, type: 'info' | 'success' | 'error' | 'warning', autoClose: boolean): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    if (autoClose) {
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    }
  }

  // ================= TOGGLE PASSWORD =================
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // ================= LOGIN FUNCTION =================
  login(): void {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    this.isLoggingIn = true;

    this.authService.login(this.email, this.password)
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('userName', response.name);
          localStorage.setItem('userEmail', response.email);
          localStorage.setItem('userRole', response.role);

          this.isLoggingIn = false;
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.isLoggingIn = false;
          console.log('Full error response:', error);

          if (typeof error.error === 'string') {
            this.errorMessage = error.error;
          } else if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else if (error.error?.error) {
            this.errorMessage = error.error.error;
          } else {
            this.errorMessage = 'Invalid email or password';
          }
        }
      });
  }

  // ================= FORGOT PASSWORD =================
  goToReset(): void {
    this.router.navigate(['/reset-password']);
  }

  // ================= GO TO REGISTER =================
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}