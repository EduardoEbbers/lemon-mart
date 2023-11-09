import { Injectable } from '@angular/core';
import { Role } from './auth.enum';
import { BehaviorSubject, Observable, catchError, filter, flatMap, map, tap, throwError } from 'rxjs';
import { IUser, User } from '../user/user/user';
import * as decode from 'jwt-decode';
import { transformError } from '../common/common';

export interface IAuthStatus {
  isAuthenticated: boolean;
  userRole: Role;
  userId: string;
}

export interface IServerAuthResponse {
  accessToken: string;
}

export const defaultAuthStatus: IAuthStatus = {
  isAuthenticated: false,
  userRole: Role.None,
  userId: ''
}

export interface IAuthService {
  readonly authStatus$: BehaviorSubject<IAuthStatus>;
  readonly currentUser$: BehaviorSubject<IUser>;
  login(email: string, password: string): Observable<void>;
  logout(clearToken?: boolean): void;
  getToken(): string;
}

@Injectable()
export abstract class AuthService implements IAuthService {
  readonly authStatus$ = new BehaviorSubject<IAuthStatus>(defaultAuthStatus);
  readonly currentUser$ = new BehaviorSubject<IUser>(new User());

  constructor() { }

  login(email: string, password: string): Observable<void> {
    const loginResponse$ = this.authProvider(email, password)
      .pipe(
        map(value => {
          const token = decode(value.accessToken);
          return this.transformJwtToken(token);
        }),
        tap(status => this.authStatus$.next(status)),
        filter((status: IAuthStatus) => status.isAuthenticated),
        flatMap(() => this.getCurrentUser()),
        map(user => this.currentUser$.next(user)),
        catchError(transformError)
      );
    
    loginResponse$.subscribe({
      error: err => {
        this.logout();
        return throwError(err);
      }
    });

    return loginResponse$;
  }

  logout(clearToken?: boolean | undefined): void {
    setTimeout(() => this.authStatus$.next(defaultAuthStatus), 0);
  }

  getToken(): string {
    throw new Error('Method not implemented.');
  }

  protected abstract authProvider(email: string, password: string): Observable<IServerAuthResponse>;
  protected abstract transformJwtToken(token: unknown): IAuthStatus;
  protected abstract getCurrentUser(): Observable<IUser>;
}
