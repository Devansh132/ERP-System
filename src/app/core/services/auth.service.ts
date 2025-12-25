import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { getFirebaseBackend } from '../../authUtils';
import { User } from 'src/app/store/Authentication/auth.models';
import { ApiService } from './api.service';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../../../environments/environment';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

@Injectable({ providedIn: 'root' })

export class AuthenticationService {

    user: User;
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser$: Observable<User | null>;

    constructor(
        private api: ApiService,
        private tokenStorage: TokenStorageService
    ) {
        const savedUser = this.tokenStorage.getUser();
        this.currentUserSubject = new BehaviorSubject<User | null>(savedUser);
        this.currentUser$ = this.currentUserSubject.asObservable();
    }

    /**
     * Returns the current user
     */
    public currentUser(): User | null {
        if (environment.defaultauth === 'jwt') {
            return this.currentUserSubject.value;
        }
        return getFirebaseBackend().getAuthenticatedUser();
    }

    /**
     * Get current user value (synchronous)
     */
    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    /**
     * Performs the auth - Real Backend API
     * @param email email of user
     * @param password password of user
     */
    login(email: string, password: string): Observable<LoginResponse | any> {
        if (environment.defaultauth === 'jwt') {
            return this.api.post<LoginResponse>('auth/login', { email, password }).pipe(
                map(response => {
                    // Store token and user
                    this.tokenStorage.saveToken(response.token);
                    const user: any = {
                        id: response.user.id,
                        email: response.user.email,
                        username: response.user.email,
                        role: response.user.role,
                        token: response.token
                    };
                    this.tokenStorage.saveUser(user);
                    this.currentUserSubject.next(user);
                    return response;
                })
            );
        } else {
            // Firebase or fake backend
            return from(getFirebaseBackend().loginUser(email, password).pipe(map((user: any) => {
                return user;
            })));
        }
    }

    /**
     * Performs the register - Real Backend API
     * @param user User object with email, password, role
     */
    register(user: { email: string; password: string; role: string }): Observable<any> {
        if (environment.defaultauth === 'jwt') {
            return this.api.post('auth/register', user);
        } else {
            // Firebase backend
            return from(getFirebaseBackend().registerUser(user).then((response: any) => {
                const user = response;
                return user;
            }));
        }
    }

    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {
        if (environment.defaultauth === 'jwt') {
            // TODO: Implement password reset API endpoint
            throw new Error('Password reset not implemented yet');
        }
        return getFirebaseBackend().forgetPassword(email).then((response: any) => {
            const message = response.data;
            return message;
        });
    }

    /**
     * Logout the user
     */
    logout() {
        if (environment.defaultauth === 'jwt') {
            this.tokenStorage.signOut();
            this.currentUserSubject.next(null);
        } else {
            getFirebaseBackend().logout();
        }
    }
}

