import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  // ================= FORM FIELDS =================
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = 'STUDENT_ASSISTANT';

  // ================= UI STATES =================
  errorMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isRegistering: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // ================= TOGGLE FUNCTIONS =================
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // ================= PASSWORD RULE CHECKS =================

  hasMinLength(): boolean {
    return this.password.length >= 12;
  }

  hasUppercase(): boolean {
    return /[A-Z]/.test(this.password);
  }

  hasLowercase(): boolean {
    return /[a-z]/.test(this.password);
  }

  hasNumber(): boolean {
    return /\d/.test(this.password);
  }

  hasSymbol(): boolean {
    return /[\W_]/.test(this.password);
  }

  isPasswordValid(): boolean {
    return this.hasMinLength()
        && this.hasUppercase()
        && this.hasLowercase()
        && this.hasNumber()
        && this.hasSymbol();
  }

  passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  isConfirmInvalid(): boolean {
    return this.confirmPassword.length > 0 && !this.passwordsMatch();
  }

  // ================= REGISTER FUNCTION =================
  register(): void {

    this.errorMessage = '';

    if (!this.isPasswordValid()) {
      this.errorMessage = "Password does not meet security requirements.";
      return;
    }

    if (!this.passwordsMatch()) {
      this.errorMessage = "Passwords do not match.";
      return;
    }

    this.isRegistering = true;

    this.authService.register(
      this.name,
      this.email,
      this.password,
      this.role
    ).subscribe({
      next: () => {
        this.isRegistering = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isRegistering = false;
        this.errorMessage =
          error.error?.message || 'Registration failed';
      }
    });
  }

  // ================= NAVIGATION =================
  goBack(): void {
    this.router.navigate(['/']);
  }
}