import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { SquareComponent } from './seat-order/seat-order.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { UserSigninFormComponent } from './user-signin-form/user-signin-form.component';
import { CanvasComponent } from './canvas/canvas.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeroComponent } from './hero/hero.component';

 
@NgModule({
 declarations: [
   AppComponent,
   EmployeesListComponent,
   EmployeeFormComponent,
   AddEmployeeComponent,
   EditEmployeeComponent,
   SquareComponent,
   ReservationFormComponent,
   UserRegistrationFormComponent,
   UserSigninFormComponent,
   CanvasComponent,
   NavbarComponent,
   HeroComponent
 ],
 imports: [
   BrowserModule,
   AppRoutingModule,
   HttpClientModule,
   ReactiveFormsModule // <-- add this line
 ],
 providers: [],
 bootstrap: [AppComponent]
})
export class AppModule { }
