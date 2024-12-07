
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { merge } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  userData: object = {};
  role = new FormControl(null, [Validators.required]);
  roleError = signal('');
  httpError: string = '';
  @Input() email: FormControl = new FormControl();
  @Input() password: FormControl = new FormControl();


  @Output() registrationCompletedEvent = new EventEmitter<any>();

  constructor(private service: UserService, private router: Router) {}

  onSubmit() {
    if(this.email.value === null || this.password.value)
    this.userData = {
      email: this.email.value,
      password: this.password.value,
      role: this.role.value
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
              let errorObject = error.error.errors;
              let firstError = Object.values(errorObject)[0];
              this.httpError = firstError as string;
            }
          });
      },
      error: (error) => {
        let errorObject = error.error.errors;
        let firstError = Object.values(errorObject)[0];
        this.httpError = firstError as string;
      }
    });

    


  }
}

