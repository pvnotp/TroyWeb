
import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  userName: string = '';
  role: string = '';

  @Output() registrationCompletedEvent = new EventEmitter<boolean>();
  constructor(private service: UserService) { }

  onSubmit() {
    const userData = {
      "userName": this.userName,
      "role": this.role
    }
    this.service.createUser(userData)
      .subscribe({
        next: (res: any) => {
          this.registrationCompletedEvent.emit(true);
        },
      });
  }
}

