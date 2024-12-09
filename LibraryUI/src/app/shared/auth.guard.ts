import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean>{
    return this.userService.getUserRole()
      .pipe(
        map(role => {
          console.log(role);
          if (this.authService.getToken() &&
            (!route.data['librarianOnly'] ||
              role === "Librarian")) {
            return true;
          } else {
            this.router.navigate(['/login']);
            return false;
          }
        })
      );
  }
}
