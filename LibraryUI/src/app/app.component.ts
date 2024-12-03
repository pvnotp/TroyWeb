import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthService } from './shared/services/auth.service';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, LoginComponent, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title: string = 'Library Login';

  constructor(private authService: AuthService, private router: Router) { }


  logout() {
    this.authService.revokeToken();
    this.router.navigate(["/login"]);
  }

}
