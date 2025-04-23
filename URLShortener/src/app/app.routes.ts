import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { CreateUrlComponent } from './shortener/create-url/create-url.component';
import { MyUrlsComponent } from './shortener/my-urls/my-urls.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: CreateUrlComponent },
      { path: 'my-urls', component: MyUrlsComponent },
    ],
  },
  { path: '**', redirectTo: '/login' }, // Перенаправляем неавторизованных на логин
];
