import {
	AfterViewInit,
	Component,
	ElementRef,
	OnInit,
	ViewChild,
} from '@angular/core';
import { PlayerBridgeService } from '../player-bridge.service';
import { Song } from '@rp/service';

@Component({
	selector: 'rumble-player-playlist',
	templateUrl: './playlist.component.html',
	styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements AfterViewInit {
	defaultImage =
		'https://i.scdn.co/image/ab67706f00000003c414e7daf34690c9f983f76e';
	image: string;
	@ViewChild('header') header: ElementRef<HTMLDivElement> | undefined;
	@ViewChild('header2') header2: ElementRef<HTMLDivElement> | undefined;

	playlist: Song[] = []

	isHome = true;

	constructor(public bridge: PlayerBridgeService) {}

	ngAfterViewInit() {
		if (this.header) {
		  this.bridge.playlist.asObservable().subscribe(playlist => {
        if (playlist.length>0 && playlist[0].albumArt) {
          const icon = this.header.nativeElement.querySelector('img');
          this.image = playlist[0].albumArt;
          icon.setAttribute('src', this.image);
          this.playlist = playlist;
        } else {
          const icon = this.header.nativeElement.querySelector('img');
          this.image = this.defaultImage;
          icon.setAttribute('src', this.image);
          this.playlist = playlist;
        }
      })
		}
	}
}
