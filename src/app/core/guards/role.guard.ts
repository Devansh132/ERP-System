import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private tokenStorage: TokenStorageService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // Get expected roles from route data
        const expectedRoles = route.data['roles'] as Array<string>;
        
        if (!expectedRoles || expectedRoles.length === 0) {
            // No role restriction, allow access
            return true;
        }

        // Get current user
        let currentUser: any = null;
        
        if (environment.defaultauth === 'jwt') {
            // JWT authentication - get from TokenStorage or AuthService
            currentUser = this.tokenStorage.getUser() || this.authenticationService.currentUserValue;
        } else if (environment.defaultauth === 'firebase') {
            currentUser = this.authenticationService.currentUser();
        } else {
            // Fake backend
            currentUser = this.authenticationService.currentUserValue;
        }

        // Check if user is logged in
        if (!currentUser) {
            this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }

        // Check if user has required role
        const userRole = currentUser.role || currentUser.roles?.[0];
        
        if (!userRole) {
            // No role assigned, redirect to unauthorized
            this.router.navigate(['/pages/unauthorized']);
            return false;
        }

        // Check if user role matches any of the expected roles
        const hasRequiredRole = expectedRoles.includes(userRole);
        
        if (!hasRequiredRole) {
            // User doesn't have required role, redirect to unauthorized
            this.router.navigate(['/pages/unauthorized']);
            return false;
        }

        return true;
    }
}



