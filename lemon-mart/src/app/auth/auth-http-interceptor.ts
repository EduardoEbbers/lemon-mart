import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class AuthHttpInterceptor {
  constructor(private authService: AuthService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwt = this.authService.getToken();
    const authRequest = req.clone({
      setHeaders: {
        authorization: `Bearer ${jwt}`
      }
    });
    return next.handle(authRequest).pipe(
      catchError((err, caught) => {
        if(err.status === 401) {
          this.router.navigate(
            ['/login'],
            { queryParams: {
              redirectUrl: this.router.routerState.snapshot.url
            }}
          )
        }
        return throwError(err);
      })
    );
  }
}
