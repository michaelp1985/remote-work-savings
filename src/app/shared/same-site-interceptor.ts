import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SameSiteInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cookie = document.cookie;
    const updatedCookie = `${cookie}; SameSite=None; Secure;`;
    document.cookie = updatedCookie;
    return next.handle(request);
  }
}
