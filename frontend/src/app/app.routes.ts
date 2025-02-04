import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { AddApplianceComponent } from './pages/add-appliance/add-appliance.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'add-appliance', component: AddApplianceComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redireciona para a tela de login por padrão
  { path: '**', redirectTo: 'login' }, // Redireciona para login em rotas inválidas
  
];
