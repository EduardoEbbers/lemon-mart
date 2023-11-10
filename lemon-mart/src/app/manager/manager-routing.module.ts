import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerHomeComponent } from './manager-home/manager-home.component';
import { ManagerComponent } from './manager.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ReceiptLookupComponent } from './receipt-lookup/receipt-lookup.component';
import { AuthGuard } from '../auth/auth-guard.service';
import { Role } from '../auth/auth.enum';

const routes: Routes = [
  //{ path: '', redirectTo: '/manager/home', pathMatch: 'full' },
  //{ path: 'home', component: ManagerHomeComponent   },
  { 
    path: '',
    component: ManagerComponent,
    children: [
      { path: '', redirectTo: '/manager/home', pathMatch: 'full' },
      { 
        path: 'home', 
        component: ManagerHomeComponent,
        canActivate: [AuthGuard],
        data: {
          expectedRole: Role.Manager
        }
      },
      { 
        path: 'users', 
        component: UserManagementComponent,
        canActivate: [AuthGuard],
        data: {
          expectedRole: Role.Manager
        }
      },
      { 
        path: 'receipts', 
        component: ReceiptLookupComponent,
        canActivate: [AuthGuard],
        data: {
          expectedRole: Role.Manager
        }
      },  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
