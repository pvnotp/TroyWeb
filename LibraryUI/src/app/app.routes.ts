import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'
import { BookViewComponent } from './bookView/bookView.component'
import { EditorComponent } from './editor/editor.component'
import { AuthGuard } from './shared/auth.guard'



export const routes: Routes = [
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
  },
  {
    path: 'bookView',
    title: 'Our Collection',
    component: BookViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'editor',
    title: 'Book Editor',
    component: EditorComponent,
    canActivate: [AuthGuard],
    data: { librarianOnly: true }
  },
  { path: '', redirectTo: 'login', pathMatch: 'full'}

];
