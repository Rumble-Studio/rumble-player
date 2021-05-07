import { Injectable } from '@angular/core';
import { PlayerHTML, PlayerService } from '@rumble-player/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerBridgeService {

  public playerService: PlayerService;
  public playerHTML: PlayerHTML;
  constructor() {
    this.playerHTML = new PlayerHTML()
    this.playerService = new PlayerService()
  }
}
