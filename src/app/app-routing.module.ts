import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ManageComponent } from './components/manage/manage.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MotelComponent } from './components/motel/motel.component';
import { MotelPendingComponent } from './components/motel-pending/motel-pending.component';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'manage', component: ManageComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'motels', component: MotelComponent },
      { path: 'motels-pending', component: MotelPendingComponent },
    ],
   },
  { path: '**', redirectTo: 'login' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
