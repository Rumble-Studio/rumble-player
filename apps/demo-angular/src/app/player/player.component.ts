import { Component, ElementRef, OnInit } from '@angular/core';
import { RumblePlayer } from '@rumble-player/rp';

@Component({
  selector: 'rumble-player-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  private player: RumblePlayer
  private EVENTLIST = ['seek','play','pause','stop','next','previous','indexChange']
  public eventsHistory: string[]
  constructor(private ref : ElementRef){}

  ngOnInit(): void {
    this.eventsHistory = []
    this.player = (this.ref.nativeElement as HTMLElement).childNodes[0] as RumblePlayer
    this.EVENTLIST.forEach(value => {
      this.player.addEventListener(value, ($event:CustomEvent)=>{
        this.eventsHistory.push('Event type: ' + value + ', data : ' + JSON.stringify($event.detail))
      })
    })
  }

}
