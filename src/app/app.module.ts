import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMaterialModule } from './shared/ng-material-module.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user.service';

const routes: Routes = [
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },  
  { path: '**', redirectTo: 'dashboard' }
]

@NgModule({
  declarations: [
    AppComponent,    
  ],
  imports: [
    BrowserModule,    
    BrowserAnimationsModule,
    NgMaterialModule,    
    DashboardModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
