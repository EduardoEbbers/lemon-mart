import { Injectable } from '@angular/core';
import { AuthService, IAuthStatus, IServerAuthResponse } from '../auth.service';
import { Observable, of, throwError } from 'rxjs';
import { Role } from '../auth.enum';
import { sign } from 'fake-jwt-sign';
import { IUser, PhoneType, User } from 'src/app/user/user/user';

@Injectable()
export class InMemoryAuthService extends AuthService {
  private defaultUser = User.Build({
    _id: '5da01751da27cc462d265913',
    email: 'du@gmail.com',
    name: {
      first: 'du',
      last: 'da'
    },
    picture: 'https://secure.gravatar.com/avatar/7cbaa9afb5ca78d97f3c689f8ce6c985',
    role: Role.Manager,
    dateOfBirth: new Date(1980, 1, 1),
    userStatus: true,
    address: {
      line1: '101 sesa St.',
      city: 'California',
      state: 'NY',
      zip: '1234'
    },
    level: 2,
    phones: [
      {
        id: 0,
        type: PhoneType.Mobile,
        digits: '555512312'
      }
    ]
  })


  constructor() { 
    super();
    console.warn("You're using the InMemoryAuthService. Do not use this service in production.");
  }

  protected authProvider(email: string, password: string): Observable<IServerAuthResponse> {
    email = email.toLowerCase();
    if(!email.endsWith('@test.com')) {
      return throwError('Failed to login! Email needs to end with @test.com');
    }

    const authStatus = {
      isAuthenticated: true,
      userId: this.defaultUser._id,
      userRole: email.includes('cashier')
        ? Role.Cashier : email.includes('clerk')
        ? Role.Clerk : email.includes('manager')
        ? Role.Manager : Role.None
    } as IAuthStatus;

    this.defaultUser.role = authStatus.userRole;

    const authResponse = {
      accessToken: sign(authStatus, 'secret', { expiresIn: '1h', algorithm: 'none' })
    } as IServerAuthResponse;

    return of(authResponse);
  }

  protected transformJwtToken(token: IAuthStatus): IAuthStatus {
    return token;
  }

  protected getCurrentUser(): Observable<IUser> {
      return of(this.defaultUser);
  }
}
