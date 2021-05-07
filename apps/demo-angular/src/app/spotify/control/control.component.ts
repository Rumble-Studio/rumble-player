import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PlayerBridgeService } from '../player-bridge.service';

@Component({
  selector: 'rumble-player-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit, AfterViewInit {
  @Input() icon;
  @Input() task;
  @Input() additionalClass;

  @ViewChild('container')
  container: ElementRef<HTMLDivElement> | undefined

  constructor(public bridge: PlayerBridgeService) {
    //
  }

  ngOnInit(): void {

  }
  ngAfterViewInit() {
    if(this.container){
      const icon = this.container.nativeElement.children.item(0)
      icon.innerHTML = this.icon
      if (this.additionalClass){
        icon.classList.add(this.additionalClass)
      }
      if (this.task === 'play'){
        this.bridge.playerHTML.addEventListener('play',()=>{this.changeIcon('pause_circle_outline')})
        this.bridge.playerHTML.addEventListener('pause',()=>{this.changeIcon('play_circle_outline')})
      } else if (this.task === 'loop'){
        this.container.nativeElement.addEventListener('click',()=>{
          const elt = (this.container.nativeElement.children.item(0) as HTMLElement)
          if (this.bridge.playerService.loop){
            this.bridge.playerService.loop = false
            elt.style.color = '#8d8b8b'
          }
          else {
            this.bridge.playerService.loop = true
            elt.style.color = 'white'
          }
        })

      } else if (this.task === 'shuffle'){
        this.container.nativeElement.addEventListener('click',()=>{
          const elt = (this.container.nativeElement.children.item(0) as HTMLElement)
          if (this.bridge.playerService.shuffle){
            this.bridge.playerService.shuffle = false
            elt.style.color = '#8d8b8b'
          }
          else {
            this.bridge.playerService.shuffle = true
            if(this.bridge.playerService.playlist.length>0) elt.style.color = 'white'
          }
        })
      }
    }
  }


  private changeIcon(value: string) {
    this.icon = value
    const icon = this.container.nativeElement.children.item(0)
    icon.innerHTML = this.icon
  }
}
