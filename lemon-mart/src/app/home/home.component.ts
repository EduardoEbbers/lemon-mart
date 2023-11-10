import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { combineLatest, filter, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  //displayLogin = true;
  
  //constructor(private authService: AuthService, private router: Router) { }
  constructor(public authService: AuthService, private router: Router) { }

  /*
  login() {
    this.authService.login('manager@test.com', '12345678');
    
    combineLatest([
      this.authService.authStatus$,
      this.authService.currentUser$
    ]).pipe(
      filter(([authStatus, user]) => authStatus.isAuthenticated && user?._id !== ''),
      tap(([authStatus, user]) => this.router.navigate(['/manager']))
    ).subscribe();
  }
  */
}
