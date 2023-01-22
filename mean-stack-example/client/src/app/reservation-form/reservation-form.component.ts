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
  templateUrl: './reservation-form.component.html',
  styles: []
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
