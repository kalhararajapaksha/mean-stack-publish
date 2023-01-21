import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Station } from './station';

@Injectable({
  providedIn: 'root'
})
export class StationService {
  private url = 'http://localhost:5200';
  private Stations$: Subject<Station[]> = new Subject();

  constructor(private httpClient: HttpClient) { }

  private refreshStations() {
    this.httpClient.get<Station[]>(`${this.url}/stations`)
      .subscribe(Stations => {
        this.Stations$.next(Stations);
      });
  }

  getStations(): Subject<Station[]> {
    this.refreshStations();
    return this.Stations$;
  }
  
}
