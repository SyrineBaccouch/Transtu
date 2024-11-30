import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';  
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RecupMdpComponent } from './recup-mdp/recup-mdp.component';
import { PreferencesComponent } from './preferences/preferences.component';

const routes: Routes = [
  
  { path: '', redirectTo: '/accueil', pathMatch: 'full' }, 
  { path: 'accueil', component: AccueilComponent } ,
  { path: 'register', component: RegisterComponent } ,
  { path: 'login', component: LoginComponent } ,
  { path: 'register', component: RecupMdpComponent }, 
  { path: 'preferences', component: PreferencesComponent } 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
