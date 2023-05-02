import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMaterialModule } from './shared/ng-material-module.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user.service';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { SameSiteInterceptor } from './shared/same-site-interceptor';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgMaterialModule,
    DashboardModule,
    HttpClientModule,
    RecaptchaV3Module,
    RouterModule.forRoot(routes),
  ],
  providers: [
    UserService,
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: '6LfVFSQlAAAAALmLfnB0_rhfCYYR8aaUMd_7tUEE',
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SameSiteInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
