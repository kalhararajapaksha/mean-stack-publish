import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Train } from './train';


@Injectable({
  providedIn: 'root'
})
export class TrainService {
  private url = 'http://localhost:5200';
  private Trains$: Subject<Train[]> = new Subject();

  constructor(private httpClient: HttpClient) { }

  private refreshTrains() {
    this.httpClient.get<Train[]>(`${this.url}/trains`)
      .subscribe(Trains => {
        this.Trains$.next(Trains);
      });
  }

  getTrains(): Subject<Train[]> {
    this.refreshTrains();
    return this.Trains$;
  }
}
