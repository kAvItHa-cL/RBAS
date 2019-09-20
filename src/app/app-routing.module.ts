import { MainComponent } from './main/main.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { MenuComponent } from './menu/menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';


const routes: Routes = [

  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'adminpanel', component: AdminPanelComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] }},
  { path : 'forgotpassword', component : ForgotPasswordComponent},
  {path : 'resetpassword', component: ResetPasswordComponent}
  // {
  //   path: 'main', component: MainComponent,
  //   children: [
  //     { path: '', redirectTo: 'profile', pathMatch: 'full' },
   //     { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  //     { path: 'adminpanel', component: AdminPanelComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
