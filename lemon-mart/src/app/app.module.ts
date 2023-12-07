import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ManagerModule } from './manager/manager.module';
import { InventoryModule } from './inventory/inventory.module';
import { PosModule } from './pos/pos.module';
import { UserModule } from './user/user.module';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { InMemoryAuthService } from './auth/in-memory-auth/auth.inmemory.service';
import { AuthHttpInterceptor } from './auth/auth-http-interceptor';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleDialogComponent } from './common/simple-dialog/simple-dialog.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FirebaseAuthService } from './auth/firebase-auth/auth.firebase.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    LoginComponent,
    SimpleDialogComponent,
    NavigationMenuComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    //ManagerModule,
    //InventoryModule,
    //PosModule,
    //UserModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp({"projectId":"lemon-90f60","appId":"1:1077902521276:web:8dfeb36a517dbcb55d71b9","storageBucket":"lemon-90f60.appspot.com","apiKey":"AIzaSyBKJ6P65FVI8K4U-ooYJjllvQqesdlnyLQ","authDomain":"lemon-90f60.firebaseapp.com","messagingSenderId":"1077902521276","measurementId":"G-LESYR9PY47"})),
    provideAuth(() => getAuth())
  ],
  providers: [
    //{ provide: AuthService, useClass: InMemoryAuthService },
    { provide: AuthService, useClass: FirebaseAuthService },
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
