import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PlayerBridgeService } from '../player-bridge.service';
import { Song } from '@rumble-player/player';

@Component({
  selector: 'rumble-player-playlist-item',
  templateUrl: './playlist-item.component.html',
  styleUrls: ['./playlist-item.component.scss']
})
export class PlaylistItemComponent implements OnInit, AfterViewInit {

  @ViewChild('container') container : ElementRef<HTMLDivElement> | undefined
  @Input() index: number;
  @Input() song: Song;
  @Input() header: boolean
  constructor(public bridge: PlayerBridgeService) { }

  ngOnInit(): void {
  //
 }
  public secondesTo(timestamp:number){

    const hours = Math.floor(timestamp / 60 / 60);
    const minutes = Math.floor(timestamp / 60) - (hours * 60);
    const seconds = timestamp % 60;

    const formatted = hours.toFixed(0).padStart(2, '0') + ':'
      + minutes.toFixed(0).padStart(2, '0') + ':'
      + seconds.toFixed(0).padStart(2, '0');

    return formatted
  }
  onPlay(){
    if (this.bridge.playerService.isPlaying){
      console.log('CASE 1', this.index)

      if(this.bridge.playerService.index === this.index){
        this.bridge.playerHTML.pause({index:this.index})
      } else {
        console.log('CASE 2', this.index)

        this.bridge.playerHTML.stop()
        this.bridge.playerHTML.play({index:this.index})
      }
    } else {
      console.log('CASE 3', this.index)
      this.bridge.playerHTML.play({index:this.index})
    }
  }
  ngAfterViewInit() {
    if (this.container){
      this.bridge.playerHTML.addEventListener('play',(paylaod:CustomEvent)=>{
        if(paylaod.detail.index === this.index){
          const icon = this.container.nativeElement.querySelector('mat-icon')
          icon.textContent = 'pause_circle_outline'
        }

      })
      this.bridge.playerHTML.addEventListener('pause',(paylaod:CustomEvent)=>{

          const icon = this.container.nativeElement.querySelector('mat-icon')
          icon.textContent = 'play_circle_outline'

      })
    }
  }

}
