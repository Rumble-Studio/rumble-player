import { Injectable } from '@angular/core';
import { PlayerHTML } from '@rumble-player/player';

import { BehaviorSubject } from 'rxjs';
import { PlayerService, Song } from '@rumble-player/service';

@Injectable({
  providedIn: 'root'
})
export class PlayerBridgeService {

  public playerService: PlayerService;
  public playerHTML: PlayerHTML;
  public playlist: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([])
  public index: BehaviorSubject<number> = new BehaviorSubject<number>(-1)
  public percentage: BehaviorSubject<number> = new BehaviorSubject(0)
  public playing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  constructor() {
    this.playerHTML = new PlayerHTML()
    this.playerService = new PlayerService()
    this.index.next(this.playerService.index);
    this.percentage.next(this.playerService.percentage)
    this.playing.next(this.playerService.isPlaying)
    this.playlist.next(this.playerService.playlist)
  }
}
