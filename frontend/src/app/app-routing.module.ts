import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewMeetingComponent } from './components/new-meeting/new-meeting.component';


const routes: Routes = [
  { path: '', redirectTo: "login", pathMatch: 'full' },
  { path: "login", component: LoginComponent },
  { path: "signIn", component: SignInComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "newmeeting", component: NewMeetingComponent },
  { path: "**", redirectTo: "login", pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
