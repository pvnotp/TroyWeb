import { Component, EventEmitter, Output } from '@angular/core';
import { RegistrationComponent } from '../registration/registration.component';
import { UserService } from '../shared/services/user.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RegistrationComponent, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isNewUser: boolean = false;
  email: string = '';
  password: string = '';

  constructor(private userService: UserService, private authService: AuthService, private router: Router) { }

  initializeNewUserState() {
    this.isNewUser = true;
  }

  receiveRegistrationCompletedEvent($event: boolean) {
    this.isNewUser = !$event;
  }

  @Output() userLoggedInEvent = new EventEmitter<string>();

  login() {
    const userData = {
      "email": this.email,
      "password": this.password,
    }
    this.userService.loginUser(userData)
      .subscribe({
        next: (res: any) => {
          this.authService.login();
          this.userService.setUserId(res.id);
          this.router.navigate(['/featured']);
        }
      });

    this.authService.getRole(this.email)
      .subscribe({
        next: (res: any) => {
          this.userService.setUserRole(res);
        },
      });
  }
}
