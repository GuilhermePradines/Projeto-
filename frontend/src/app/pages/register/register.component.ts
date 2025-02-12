import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import {Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule],  
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email = '';
  username = '';
  password = '';
  confirmPassword = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (this.password !== this.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    this.authService.register({ email: this.email, username: this.username, password: this.password, confirmPassword: this.confirmPassword })
      .subscribe({
        next: (response: any) => {
          alert(response?.message || "User registered successfully");
          this.router.navigate(['/login']);
          
          
        },
        error: (err) => {
          console.error('Error during registration:', err);
          this.router.navigate(['/login']);
         
        }
      });
  }
}

