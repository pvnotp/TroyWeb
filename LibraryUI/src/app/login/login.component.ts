import { Component } from '@angular/core';
import { RegistrationComponent } from '../registration/registration.component';
import { UserService } from '../shared/services/user.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RegistrationComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isNewUser: boolean = false;
  userName: string = '';

  constructor(private userService: UserService, private authService: AuthService, private router: Router) { }

  initializeNewUserState() {
    this.isNewUser = true;
  }

  receiveRegistrationCompletedEvent($event: boolean) {
    this.isNewUser = !$event;
  }

  login() {
  
    this.userService.getUser(this.userName)
      .subscribe({
        next: (res: any) => {
          this.authService.login();
          this.router.navigate(['/featured']); 
        }
      });

    this.authService.getRole(this.userName)
      .subscribe({
        next: (res: any) => {
        },
      });
  }
}
