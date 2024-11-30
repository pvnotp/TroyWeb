import { Component, EventEmitter, Output, Signal, signal } from '@angular/core';
import { RegistrationComponent } from '../registration/registration.component';
import { UserService } from '../shared/services/user.service';
import { EmailValidator, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RegistrationComponent, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isNewUser: boolean = false;
  email = new FormControl('', [Validators.email, Validators.required]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)])
  userId: string = '';
  emailError = signal('');
  passwordError = signal('');
  httpError: string = '';

  @Output() userLoggedInEvent = new EventEmitter<string>();

  constructor(private userService: UserService, private authService: AuthService, private router: Router) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .subscribe(() => { 
        if (this.email.hasError('required')) {
          this.emailError.set('You must enter a value');
        } else if (this.email.hasError('email')) {
          this.emailError.set('Not a valid email');
        } else {
          this.emailError.set('');
        }
      });

    merge(this.password.statusChanges, this.password.valueChanges)
      .subscribe(() => {
        if (this.password.hasError('required')) {
          this.passwordError.set('You must enter a value');
        } else if (this.password.hasError('minlength')) {
          this.passwordError.set('Must be at least 6 characters');
        } else {
          this.passwordError.set('hello');
        }
      });
  }

  initializeNewUserState() {
    this.isNewUser = true;
  }

  receiveRegistrationCompletedEvent($event: any) {
    this.isNewUser = false;
  }

  login() {
    console.log(this.email.value);
    const userData = {
      "email": this.email.value,
      "password": this.password.value,
    }
    this.userService.loginUser(userData)
      .subscribe({
        next: (data) => {
          if (this.email.value == null) {
            return;
          }
          this.authService.login();
          this.userService.fetchUserId(this.email.value)
            .subscribe({
              next: user => this.userService.setUserId(user),
              error: error => this.httpError = error.message
            });
          this.authService.getRole(this.email.value)
            .subscribe({
              next: (role: any) => this.userService.setUserRole(role),
              error: error => this.httpError = error.message
            });
          if (this.httpError === '') {
            this.router.navigate(['/bookView']);
          }
        },
        error: (error) => {
          console.log(error.status);
          if (error.status == 401) {
            this.httpError = "Username or email is incorrect."
          }
          else {
            this.httpError = error.message;
          }
        }
      });

    if (this.email.value == null) {
      return;
    };
    
  }
}
