import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule],
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

