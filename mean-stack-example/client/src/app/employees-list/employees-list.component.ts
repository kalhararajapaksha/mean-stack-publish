import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { Train } from '../train';
import { TrainService } from '../train.service';
 
@Component({
 selector: 'app-employees-list',
 templateUrl: 'employees-list.component.html'
})
export class EmployeesListComponent implements OnInit {
 employees$: Observable<Employee[]> = new Observable();
 trains$: Observable<Train[]> = new Observable();

 constructor(private employeesService: EmployeeService,private trainService: TrainService) { }
 
 ngOnInit(): void {
   this.fetchEmployees();
 }
 
 deleteEmployee(id: string): void {
   this.employeesService.deleteEmployee(id).subscribe({
     next: () => this.fetchEmployees()
   });
 }
 
 private fetchEmployees(): void {
   this.trains$ = this.trainService.getTrains();
  //  this.employees$ = this.employeesService.getEmployees();
  //  console.log(this.employees$);
 }
}