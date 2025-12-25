import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private authenticationService: AuthenticationService,
        private tokenStorage: TokenStorageService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                // Skip logout for login/register endpoints
                if (!request.url.includes('/auth/login') && !request.url.includes('/auth/register')) {
                    if (environment.defaultauth === 'jwt') {
                        this.tokenStorage.signOut();
                    } else {
                        this.authenticationService.logout();
                    }
                    this.router.navigate(['/auth/login']);
                }
            }
            const error = err.error?.error || err.error?.message || err.statusText || 'An error occurred';
            return throwError(() => error);
        }))
    }
}
