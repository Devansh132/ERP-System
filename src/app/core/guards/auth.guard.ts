import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Auth Services
import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import { TokenStorageService } from '../services/token-storage.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private authFackservice: AuthfakeauthenticationService,
        private tokenStorage: TokenStorageService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (environment.defaultauth === 'jwt') {
            // JWT authentication - check token and user
            const token = this.tokenStorage.getToken();
            const user = this.tokenStorage.getUser();
            if (token && user) {
                return true;
            }
        } else if (environment.defaultauth === 'firebase') {
            const currentUser = this.authenticationService.currentUser();
            if (currentUser) {
                return true;
            }
        } else {
            // Fake backend
            const currentUser = this.authFackservice.currentUserValue;
            if (currentUser) {
                return true;
            }
            // check if user data is in storage is logged in via API.
            if (localStorage.getItem('currentUser')) {
                return true;
            }
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
