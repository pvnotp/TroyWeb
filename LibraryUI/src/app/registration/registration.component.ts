
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { merge } from 'rxjs';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  userData: object = {};
  role: string = '';
  httpError: string = '';

  @Input() email: string|null = '';
  @Input() password: string|null = '';
  @Output() registrationCompletedEvent = new EventEmitter<any>();
  constructor(private service: UserService, private router: Router) {}

  onSubmit() {
    this.userData = {
      email: this.email,
      password: this.password,
      role: this.role
    }
    console.log(this.userData);
    this.service.createUser(this.userData)
    .subscribe({
      next: (res: any) => {
        this.service.setRole(this.userData)
          .subscribe({
            next: (data) => {
              this.registrationCompletedEvent.emit(this.userData);
              this.router.navigate(["/login"]);
            },
            error: (error) => {
              this.httpError = error.message;
            }
          });
      },
      error: (error) => {
        this.httpError = error.message;
      }
    });

    


  }
}

