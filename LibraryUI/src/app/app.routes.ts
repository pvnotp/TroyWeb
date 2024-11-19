import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'
import { FeaturedComponent } from './featured/featured.component'
import { EditorComponent } from './editor/editor.component'
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { AuthGuard } from './shared/auth.guard'



export const routes: Routes = [
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
  },
  {
    path: 'featured',
    title: 'Featured Books',
    component: FeaturedComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editor',
    title: 'Book Editor',
    component: EditorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'unauthorized',
    title: 'Unauthorized',
    component: UnauthorizedComponent,
  },
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: '**', redirectTo: 'login' }

];
