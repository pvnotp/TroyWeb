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
  role: string = '';
  emailError = signal('');
  passwordError = signal('');
  httpError: string = '';

  constructor(private userService: UserService, private authService: AuthService, private router: Router) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .subscribe(() => {
        this.httpError = "";
        if (this.email.hasError('required')) {
          this.emailError.set('You must enter a value');
        } else if (this.email.hasError('email')) {
          this.emailError.set('Not a valid email');
        } else {
          this.emailError.set('Try a different value');
        }
      });

    merge(this.password.statusChanges, this.password.valueChanges)
      .subscribe(() => {
        this.httpError = "";
        if (this.password.hasError('required')) {
          this.passwordError.set('You must enter a value');
        } else if (this.password.hasError('minlength')) {
          this.passwordError.set('Must be at least 6 characters');
        } else {
          this.passwordError.set('Try a different value');
        }
      });
  }

  initializeNewUserState() {
    this.isNewUser = true;
    this.httpError = '';
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
        next: (token: object) => {
          if (this.email.value == null) {
            return;
          }
          this.authService.setToken(token);
          this.userService.fetchUserId(this.email.value)
            .subscribe({
              next: user => this.userService.setUserId(user),
              error: error => this.httpError = error.message
            });
          this.userService.fetchUserRole(this.email.value)
            .subscribe({
              next: (role: any) => this.userService.setUserRole(role),
              error: error => this.httpError = error.message
            });
          if (this.httpError === '') {
            this.router.navigate(['/bookView']);
          }
        },
        error: (error) => {
          if (error.status == 401) {
            this.httpError = "Username or email is incorrect."
          }
          else {
            let errorObject = error.error.errors;
            let firstError = Object.values(errorObject)[0];
            this.httpError = firstError as string;
          }
        }
      });

    if (this.email.value == null) {
      return;
    };
    
  }
}
