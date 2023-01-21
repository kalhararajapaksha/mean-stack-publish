import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable,BehaviorSubject,combineLatest, map,of   } from 'rxjs';
import { Station } from '../station';
import { StationService } from '../station.service';
import { Train } from '../train';
import { TrainService } from '../train.service';
import { Shedule } from '../shedule';
import { SheduleService } from '../shedule.service';
import * as moment from 'moment';
@Component({
  selector: 'app-reservation-form',
  template: `
  <app-navbar></app-navbar>
  <div class="row">
  <form [formGroup]="searchForm">
  <div class="form-group">
    <label for="from">Destination:</label>
    <select class="form-control" id="from"  name="from">
    <option *ngFor="let station of stations$ | async" [value]="station._id">{{station.name}}</option>
    </select>
  </div>
  <div class="form-group">
    <label for="date">Date:</label>
    <input type="date" class="form-control" id="date"  name="date" formControlName="date">
  </div>
  <br>
  <input type="button" class="btn btn-primary" (click)="viewDetails()" value="Search">
</form>
</div>
<br>
<div class="row">
<div class="col-md-3" *ngFor="let data  of combinedFilteredData$ | async">
<div class="card">
<img src="{{ data.train.img_url}}" alt="" class="card-img-top">
<div class="card-body">
  <h5 class="card-title">{{ data.train.train_name}}</h5>
  <p class="card-text">{{ data.train.time}}</p>
  <p class="card-text">Price: Rs {{ data.train.ticket_price}}</p>
  <button class="btn btn-primary  me-1" [routerLink]="['reservation/',data.schedule?.session_ID]">View Details</button>
</div>
</div>
</div>
</div>

  `,
  styles: [
  ]
})
export class ReservationFormComponent implements OnInit {
  @Input()
  initialState: BehaviorSubject<Station> = new BehaviorSubject({});
  private session_id="123456";
  searchForm: FormGroup = new FormGroup({});
  stations$: Observable<Station[]> = new Observable();
  trains$: Observable<Train[]> = new Observable();
  shedules$: Observable<Shedule[]> = new Observable();
  filteredTrains$: Observable<Train[]> = new Observable();
  filteredShedules$: Observable<Shedule[]> = new Observable();
  combinedFilteredData$: Observable<{ train: Train; schedule: Shedule | undefined; }[]> = new Observable();
  // shedule?: Shedule;
  // train?: Train;
  

  get date() { return this.searchForm.get('date')!; }
 // <option *ngFor="let station of stations$ | async" [value]="station._id">{{station.name}}</option>
  constructor(private stationService: StationService,private trainService: TrainService,private sheduleService: SheduleService,private fb: FormBuilder) { }
  
  ngOnInit(): void {
    this.fetchStations();
    this.initialState.subscribe(employee => {
      this.searchForm = this.fb.group({
        date: [ ]       
      });
    });
  
  }
  

  
  private fetchStations(): void {
    this.stations$ = this.stationService.getStations();
  }

  viewDetails() {
    let dateString = this.searchForm.value.date;
    //let dateObject = moment.utc(dateString).toDate();
    //let formattedDate = moment.utc(dateObject).local().format();
    this.trains$ = this.trainService.getTrains();
    this.shedules$=this.sheduleService.getShedules(dateString);

    // combineLatest(this.trains$, this.shedules$).pipe(
    //   map(([trains, schedules]) => {
    //     return trains.filter(train => {
    //       return schedules.some(schedule => schedule.train_name === train.train_name);
    //     });
    //   })
    // ).subscribe(filteredTrains => {
    //   console.log("filteredTrains");
    //   console.log(filteredTrains);
    //   this.filteredTrains$ = of(filteredTrains);
    //   // do something with the filtered trains
    // });


  
    combineLatest(this.trains$, this.shedules$).pipe(
      map(([trains, schedules]) => {   
        return {
          trains: trains.filter(train => schedules.some(schedule => schedule.train_name === train.train_name)),
          schedules: schedules.filter(schedule => trains.some(train => train.train_name === schedule.train_name))
      }
      })
    ).subscribe(filteredTrains => {
      console.log("filteredTrains");
      console.log(filteredTrains.schedules);
      this.filteredTrains$ = of(filteredTrains.trains);
      this.filteredShedules$ = of(filteredTrains.schedules);
      
      // do something with the filtered trains
      this.combinedFilteredData$ = combineLatest(this.filteredTrains$, this.filteredShedules$).pipe(
        map(([filteredTrains, filteredSchedules]) => {
          return filteredTrains.map(train => {
            let schedule = filteredSchedules.find(s => s.train_name === train.train_name);
            return {
              train,
              schedule
            }
          });
        })
      )
    });


    
 
   
  }


}
