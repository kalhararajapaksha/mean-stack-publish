import { Component, ViewChild, ElementRef,Renderer2,AfterViewInit } from '@angular/core';
import { TestService } from '../test.service';

@Component({
  selector: 'app-canvas',
  template: `

  <canvas #canvas id="drawing-canvas" class="canvas-border" (mousedown)="mouseDown($event)" (mousemove)="mouseMove($event)" (mouseup)="mouseUp()"></canvas>
  `,
  styles: [`.canvas-border {
    border: 1px solid black;
    color: red !important;
    width:100%;
    height:800px;
  }`
  ]
})
export class CanvasComponent {
  @ViewChild('canvas', { static: true }) canvas?: ElementRef;
  private ctx?: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;
  color = 'red';
  items =Array.from(Array(10).keys());
  private clientID="";
  private GameID="";
  private playerColor="";
  private game=null;
  backgroundColor: string = 'white';

  

  constructor(private wsService: TestService,private renderer: Renderer2, private el: ElementRef) {
    this.items=Array.from(Array(0).keys());
    this.wsService.receive().subscribe(message => {
      if(message.method=="connect"){

        this.clientID=message.clientId;
        console.log("Connected");
        console.log(message.clientId);
        this.join();
      };
      // if(message.method=="create"){
      //   this.GameID=message.game.id;
      //   console.log("New Game Created");       
      //   console.log(message.game);
        
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
        let x=message.game.stateX;
        let y=message.game.stateY;
        if(message.game.mState=="start"){
          this.startDrawing(x,y);
        }
        if(message.game.mState=="draw"){
          this.draw(x,y);
        }
        if(message.game.mState=="end"){
          this.stopDrawing();
        }
        
        Object.entries(message.game.state).forEach(([key, value]) => {
          console.log(`${key}: ${value}`);
          
          
        });


      };
    });
  }
  
  ngAfterViewInit() {
    if(this.canvas) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
      this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth;
      this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight;
      
  }
  }

  startDrawing(lastX: number,lastY: number) {
    if(this.canvas) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    }
    this.isDrawing = true;
    this.lastX = lastX;
    this.lastY = lastY;
        this.join();
    console.log("start drawing");
  }

  draw(clientX: number,clientY: number) {
   
    if (!this.isDrawing) {
      return;
    }
    if(this.ctx){
      console.log(" drawing");
      this.ctx.strokeStyle = this.color;
      this.ctx.fillStyle=this.color;
      this.ctx.lineWidth = 13;
      this.ctx.beginPath();  
      console.log(this.lastX+","+this.lastY);
      this.ctx.moveTo(this.lastX-300, this.lastY);
      this.ctx.lineTo(clientX-300, clientY);
      this.ctx.stroke();
    }
    this.lastX = clientX;
    this.lastY = clientY;
  }

  stopDrawing() {
    console.log("stop drawing");
    this.isDrawing = false;
  }

 //Mouse event
  mouseDown(event: MouseEvent){
    //this.startDrawing(event.clientX,event.clientY);
    this.startdrawingValuesSend(event.clientX,event.clientY);
  }
  mouseUp(){
    //this.stopDrawing();
    this.enddrawingValuesSend();
  }

  mouseMove(event: MouseEvent){
    //this.draw(event.clientX,event.clientY)
    this.drawingValuesSend(event.clientX,event.clientY);
  }

  join() {

    const payLoad = {
      method: 'join',
      clientId: this.clientID,
      gameId:'230120A001',
    };
    this.wsService.send(payLoad);
  }

  startdrawingValuesSend(clientX: number,clientY: number) {

    const payLoad = {
      method: 'play',
      clientId: this.clientID,
      gameId:'230120A001',
      ballId:1,
      clientX:clientX,
      clientY:clientY,
      color:this.playerColor,
      mstate:"start"
    };
    this.wsService.send(payLoad);
  }

  drawingValuesSend(clientX: number,clientY: number) {

    const payLoad = {
      method: 'play',
      clientId: this.clientID,
      gameId:'230120A001',
      ballId:1,
      clientX:clientX,
      clientY:clientY,
      color:this.playerColor,
      mstate:"draw"
    };
    this.wsService.send(payLoad);
  }

  enddrawingValuesSend() {

    const payLoad = {
      method: 'play',
      clientId: this.clientID,
      gameId:'230120A001',
      ballId:1,
      clientX:0,
      clientY:0,
      color:this.playerColor,
      mstate:"end"
    };
    this.wsService.send(payLoad);
  }




}
