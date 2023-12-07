import { Injectable, inject } from '@angular/core';
import { AuthService, IAuthStatus, IServerAuthResponse, defaultAuthStatus } from '../auth.service';
import { 
  Auth as FireAuth,
  User as FireUser,
  signInWithEmailAndPassword,
  signOut
} from "@angular/fire/auth";
import { Observable, Subject, of } from 'rxjs';
import { IUser, User } from 'src/app/user/user/user';
import { Role } from '../auth.enum';

interface IJwtToken {
  email: string,
  iat: number,
  exp: number,
  sub: string,
}

@Injectable()
export class FirebaseAuthService extends AuthService {
  // talvez colocar isso como injecao no constructor
  private afAuth: FireAuth = inject(FireAuth);

  constructor() { 
    super();
  }

  protected authProvider(email: string, password: string): Observable<IServerAuthResponse> {
    const serverResponse$ = new Subject<IServerAuthResponse>();

    signInWithEmailAndPassword(this.afAuth, email, password)
      .then(res => {
        const firebaseUser: FireUser | null = res.user;
        
        firebaseUser?.getIdToken()
          .then(
            token => serverResponse$.next({ accessToken: token }),
            err => serverResponse$.error(err)
          );
      }, err => serverResponse$.error(err));
    
    return serverResponse$;
  }
  protected override transformJwtToken(token: IJwtToken): IAuthStatus {
    if(!token) {
      return defaultAuthStatus;
    }
    return {
      isAuthenticated: token.email ? true : false,
      userId: token.sub,
      userRole: Role.None
    }
  }
  protected override getCurrentUser(): Observable<IUser> {
    return of(this.transformFirebaseUser(this.afAuth.currentUser));
  }

  private transformFirebaseUser(firebaseUser: FireUser | null) : User {
    if(!firebaseUser) {
      return new User();
    }
    return User.Build({
      name: {
        first: firebaseUser?.displayName?.split(' ')[0] || 'Firebase',
        last: firebaseUser?.displayName?.split(' ')[1] || 'User'
      },
      picture: firebaseUser.photoURL,
      email: firebaseUser.email,
      _id: firebaseUser.uid,
      role: Role.None
    } as IUser);
  }

  override async logout() {
    if(this.afAuth) {
      await signOut(this.afAuth);
    }

    this.clearToken();
    this.authStatus$.next(defaultAuthStatus);
  }
}
