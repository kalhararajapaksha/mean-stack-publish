import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private socket$: WebSocketSubject<any>;

  constructor() {
    this.socket$ = new WebSocketSubject('ws://localhost:9090');
  }

  send(message: any) {
    this.socket$.next(message);
  }

  receive() {
    return this.socket$.asObservable();
  }
}
