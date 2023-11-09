import { Injectable } from '@angular/core';
import { Role } from './auth.enum';
import { BehaviorSubject, Observable, catchError, filter, flatMap, map, tap, throwError } from 'rxjs';
import { IUser, User } from '../user/user/user';
import * as decode from 'jwt-decode';
import { transformError } from '../common/common';
import { CacheService } from './cache.service';

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
export abstract class AuthService extends CacheService implements IAuthService {
  readonly authStatus$ = new BehaviorSubject<IAuthStatus>(defaultAuthStatus);
  readonly currentUser$ = new BehaviorSubject<IUser>(new User());

  constructor() { 
    super();
  }

  login(email: string, password: string): Observable<void> {
    this.clearToken();

    const loginResponse$ = this.authProvider(email, password)
      .pipe(
        map(value => {
          this.setToken(value.accessToken);
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
    if(clearToken) {
      this.clearToken();
    }
    setTimeout(() => this.authStatus$.next(defaultAuthStatus), 0);
  }

  getToken(): string {
    return this.getItem('jwt') ?? '';
  }

  protected setToken(jwt: string) {
    this.setItem('jwt', jwt);
  }

  protected clearToken() {
    this.removeItem('jwt');
  }

  protected abstract authProvider(email: string, password: string): Observable<IServerAuthResponse>;
  protected abstract transformJwtToken(token: unknown): IAuthStatus;
  protected abstract getCurrentUser(): Observable<IUser>;
}
