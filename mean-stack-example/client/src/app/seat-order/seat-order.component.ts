import { Component, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { TestService } from '../test.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-square',
  templateUrl: './seat-order.component.html',
  styleUrls: ['square.component.css']
})
export class SquareComponent implements AfterViewInit{
  nameControl = new FormControl('');
  items =Array.from(Array(10).keys());
  //<div class="square" *ngFor="let square of squares"></div>
  // You can use properties and methods here to keep track of the state of the square
   private clientID="";
   private GameID="";
   private playerColor="";
   private game=null;
   backgroundColor: string = 'white';



   constructor(private wsService: TestService,private renderer: Renderer2, private el: ElementRef,private router: Router,
    private route: ActivatedRoute) {
    this.items=Array.from(Array(0).keys());
    this.wsService.receive().subscribe(message => {
      if(message.method=="connect"){

        this.clientID=message.clientId;
        console.log('hello');
        console.log(this.clientID);
        const id = this.route.snapshot.paramMap.get('id');
        console.log(id);
        if (!id) {
          alert('No id provided');
        }
        else{ 
          this.GameID=id;
          console.log(this.GameID);
          this.join(id);}
      };
      // if(message.method=="create"){
      //   this.GameID=message.game.id;
      //   console.log("New Game Created");       
      //   console.log(message.game);
      //   //this.join();
      // };
      if(message.method=="join"){
        this.GameID=message.game.id;
        this.game=message.game.clients;
        console.log("You joined Successfully");
        console.log(message.game);
        message.game.clients.forEach((num: any) => {
          console.log(this.clientID);

          if(num.clientId==this.clientID){
            this.items =Array.from(Array(message.game.balls).keys());
            console.log(num);
            this.playerColor=num.color
            console.log(this.playerColor);
           // this.backgroundColor=this.playerColor;
          }
        });

      };
      if(message.method=="update"){
        console.log(message);
        console.log("Game state updated");
        if (!message.game.state) return;
        Object.entries(message.game.state).forEach(([key, value]) => {
          console.log(`${key}: ${value}`);
          this.changeColor(key,value);
        });


      };
    });
  }

  ngAfterViewInit() {
    console.log('View has been initialized');
    // Do additional setup here
  }


  join(id:any) {

    const payLoad = {
      method: 'join',
      clientId: this.clientID,
      gameId:id,
    };
    this.wsService.send(payLoad);
    console.log("send join request ")
  }

  clickOnSeat(data: any) {

    const payLoad = {
      method: 'play',
      clientId: this.clientID,
      gameId:this.GameID,
      ballId:data,
      color:this.playerColor
    };
    this.wsService.send(payLoad);
  }

  changeColor(i: any,color: any) {
    //this.backgroundColor = color;
    const div = document.getElementById(i);
    this.renderer.setStyle(div, 'background-color', color);
    //this.renderer.setStyle(this.el.nativeElement.querySelector(`#${i}`), 'background-color', this.backgroundColor);
  }


}
