import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingComponent } from './setting/setting.component';
import { Error404Component } from './error404/error404.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmailCodeComponent } from './email-code/email-code.component';
import { Error401Component } from './error401/error401.component';
import { authenticationGuard } from './guard/authentication.guard';

const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'Register',component:RegisterComponent},
  {path:'email',component:EmailCodeComponent},
  {path:'error401',component:Error401Component},
  {path:'error404',component:Error404Component},
  {path:'dashboard',component:DashboardComponent,canActivate:[authenticationGuard],children:[
  {path:'Home',component:HomeComponent},
  {path:'profile',component:ProfileComponent},
  {path:'setting',component:SettingComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
