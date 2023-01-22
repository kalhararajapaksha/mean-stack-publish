import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component'; // <-- add this line
import { EditEmployeeComponent } from './edit-employee/edit-employee.component'; // <-- add this line
import { SquareComponent } from './seat-order/seat-order.component'; // <-- add this line
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import { CanvasComponent } from './canvas/canvas.component';
import { UserSigninFormComponent } from './user-signin-form/user-signin-form.component';
 
const routes: Routes = [
 { path: '', redirectTo: 'home', pathMatch: 'full' },
 { path: 'home', component: EmployeesListComponent },
 { path: 'home/new', component: AddEmployeeComponent },
 //{ path: 'home/new', component: ReservationFormComponent },
 { path: 'home/new/reservation/:id', component: SquareComponent },// <-- add this line
 //{ path: 'home/new', component: CanvasComponent },
 { path: 'login', component: UserSigninFormComponent },
 //{ path: 'employees/new', component: SquareComponent },
 { path: 'employees/edit/:id', component: EditEmployeeComponent }]; // <-- add this line
 
 
@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule]
})
export class AppRoutingModule { }