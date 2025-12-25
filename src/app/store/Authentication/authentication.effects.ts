import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, exhaustMap, tap, first } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { AuthenticationService } from '../../core/services/auth.service';
import { login, loginSuccess, loginFailure, logout, logoutSuccess, Register, RegisterSuccess, RegisterFailure } from './authentication.actions';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { UserProfileService } from 'src/app/core/services/user.service';

@Injectable()
export class AuthenticationEffects {

  Register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Register),
      exhaustMap(({ email, username, password }) => {
        if (environment.defaultauth === 'fakebackend') {
          return this.userService.register({ email, username, password }).pipe(
            map((user) => {
              this.router.navigate(['/auth/login']);
              return RegisterSuccess({ user })
            }),
            catchError((error) => of(RegisterFailure({ error })))
          );
        } else {
          // For JWT and Firebase: role is required, defaulting to 'student' if not provided
          const role = 'student'; // You can extract this from the action if needed
          return this.AuthenticationService.register({ email, password, role }).pipe(
            map((response: any) => {
              const user: any = {
                id: response.user?.id || response.id,
                email: response.user?.email || response.email || email,
                username: username || email,
                role: response.user?.role || response.role || role,
                token: response.token
              };
              this.router.navigate(['/auth/login']);
              return RegisterSuccess({ user })
            }),
            catchError((error) => of(RegisterFailure({ error: error.message || error })))
          )
        }
      })
    )
  );



  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(({ email, password }) => {
        if (environment.defaultauth === "fakebackend") {
          return this.AuthfakeService.login(email, password).pipe(
            map((user) => {
              if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('token', user.token);
                
                // Redirect based on user role
                const role = user.role;
                if (role === 'admin') {
                  this.router.navigate(['/admin/dashboard']);
                } else if (role === 'teacher') {
                  this.router.navigate(['/teacher/dashboard']);
                } else if (role === 'student') {
                  this.router.navigate(['/student/dashboard']);
                } else {
                  this.router.navigate(['/']);
                }
              }
              return loginSuccess({ user });
            }),
            catchError((error) => of(loginFailure({ error })))
          );
        } else if (environment.defaultauth === "jwt") {
          // JWT authentication (real backend)
          return this.AuthenticationService.login(email, password).pipe(
            map((response: any) => {
              // Response structure: { token: string, user: { id, email, role } }
              const user: any = {
                id: response.user?.id,
                email: response.user?.email || email,
                username: response.user?.email || email,
                role: response.user?.role,
                token: response.token
              };
              // Token and user are already saved by AuthenticationService
              
              // Redirect based on user role
              const role = response.user?.role || user.role;
              if (role === 'admin') {
                this.router.navigate(['/admin/dashboard']);
              } else if (role === 'teacher') {
                this.router.navigate(['/teacher/dashboard']);
              } else if (role === 'student') {
                this.router.navigate(['/student/dashboard']);
              } else {
                this.router.navigate(['/']);
              }
              
              return loginSuccess({ user });
            }),
            catchError((error) => of(loginFailure({ error: error.message || error })))
          );
        } else if (environment.defaultauth === "firebase") {
          return this.AuthenticationService.login(email, password).pipe(
            map((user: any) => {
              return loginSuccess({ user });
            }),
            catchError((error) => of(loginFailure({ error: error.message || error })))
          );
        } else {
          return of(loginFailure({ error: 'Unknown authentication method' }));
        }
      })
    )
  );


  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => {
        // Perform any necessary cleanup or side effects before logging out
      }),
      exhaustMap(() => of(logoutSuccess()))
    )
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    private AuthenticationService: AuthenticationService,
    private AuthfakeService: AuthfakeauthenticationService,
    private userService: UserProfileService,
    private router: Router) { }

}