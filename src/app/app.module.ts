import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ManageComponent } from './components/manage/manage.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MotelComponent } from './components/motel/motel.component';
import { MotelPendingComponent } from './components/motel-pending/motel-pending.component';
import { InforDetailComponent } from './components/infor-detail/infor-detail.component';
import { SearchPipe } from './pipe/search.pipe';
import { UpdateMotelComponent } from './components/update-motel/update-motel.component';
import { AddMotelComponent } from './components/add-motel/add-motel.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ManageComponent,
    DashboardComponent,
    MotelComponent,
    MotelPendingComponent,
    InforDetailComponent,
    SearchPipe,
    UpdateMotelComponent,
    AddMotelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
