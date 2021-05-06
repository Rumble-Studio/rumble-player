import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PlayerHTML, PlayerService } from '@rumble-player/player';
import { SpotifyPlayButton } from './visuals/spotifyPlayButton';

@Component({
	selector: 'rumble-player-spotify',
	templateUrl: './spotify.component.html',
	styleUrls: ['./spotify.component.scss'],
})
export class SpotifyComponent implements OnInit, AfterViewInit {

  feedUrl = 'https://firebasestorage.googleapis.com/v0/b/rumble-studio-alpha.appspot.com/o' +
    '/assets%2Faudio%2Fjingles%2Fuplifting%2FUplifting-1.mp3?alt=media&token=60b80935-4468-425a-9a1a-bf84d443d2e2'

  playerHTML: PlayerHTML
  playerService: PlayerService

  @ViewChild('controlsContainer')
  controlsContainer: ElementRef<HTMLElement> | undefined;

	constructor() {
	  //
  }

	ngOnInit(): void {
	  this.playerHTML = new PlayerHTML()
    this.playerService = new PlayerService()
    this.playerHTML.setPlayerService(this.playerService)
  }
  ngAfterViewInit() {
	  if (this.controlsContainer){
      console.log('LOADEDing')

      const spButton = new SpotifyPlayButton()
      spButton.playerHTML = this.playerHTML
      console.log('LOADED',spButton)

      this.controlsContainer.nativeElement.appendChild(spButton)
      this.playerService.setPlaylistFromUrls([this.feedUrl])
    }
    else {
      console.warn('Container Linear is not available');
    }
  }

}
