
import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  email: string = '';
  password: string = '';
  role: string = '';
  error: string = '';

  @Output() registrationCompletedEvent = new EventEmitter<any>();
  constructor(private service: UserService, private router: Router) { }

  onSubmit() {

    const userData = {
      "email": this.email,
      "password": this.password,
      "role": this.role
    }

    this.service.createUser(userData)
    .subscribe({
      next: (res: any) => {
        this.service.setRole(userData)
          .subscribe({
            next: (data) => {
              this.registrationCompletedEvent.emit(userData);
              this.router.navigate(["/login"]);
            },
            error: (error) => {
              console.log(error.message);
            }
          });
      },
      error: (error) => {
        console.log(error.error.errors.InvalidEmail[0]);
      }
    });

    


  }
}

