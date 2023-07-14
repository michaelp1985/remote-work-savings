import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SameSiteInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {    
    // Get the cookie header from the request
    const cookieHeader = request.headers.get('Cookie');

    if (cookieHeader) {
      // Add the SameSite attribute to the existing cookies
      const modifiedCookieHeader = `${cookieHeader}; SameSite=None; Secure`;

      // Clone the request and set the modified cookie header
      request = request.clone({
        setHeaders: {
          Cookie: modifiedCookieHeader,
        },
      });
    }

    // Pass the modified request to the next interceptor or the server
    return next.handle(request);
  }
}
