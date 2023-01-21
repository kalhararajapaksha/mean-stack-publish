import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Shedule } from './shedule';

@Injectable({
  providedIn: 'root'
})
export class SheduleService {
  private url = 'http://localhost:5200';
  private shedules$: Subject<Shedule[]> = new Subject();

  constructor(private httpClient: HttpClient) { }

  private refreshEmployees() {
    this.httpClient.get<Shedule[]>(`${this.url}/shedules`)
      .subscribe(shedule => {
        this.shedules$.next(shedule);
      });
  }
  
  getEmployees(): Subject<Shedule[]> {
    this.refreshEmployees();
    return this.shedules$;
  }
  
  getShedulesByDate(date: string){
     this.httpClient.get<Shedule[]>(`${this.url}/shedules/${date}`)
    .subscribe(shedule => {
      this.shedules$.next(shedule);
    });
  }
  
  getShedules(date: string){
    this.getShedulesByDate(date);
    return this.shedules$;
 }
}

