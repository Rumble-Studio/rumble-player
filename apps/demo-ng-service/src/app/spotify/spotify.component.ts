import {
	AfterViewInit,
	Component,
	ElementRef,
	OnInit,
	ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoadDialogComponent } from './load-dialog/load-dialog.component';
import { PlayerBridgeService } from './player-bridge.service';
import { MatSliderChange } from '@angular/material/slider';
import { Song } from '@rumble-player/service';

@Component({
	selector: 'rumble-player-spotify',
	templateUrl: './spotify.component.html',
	styleUrls: ['./spotify.component.scss'],
})
export class SpotifyComponent implements AfterViewInit {
	feedUrl =
		'https://firebasestorage.googleapis.com/v0/b/rumble-studio-alpha.appspot.com/o' +
		'/assets%2Faudio%2Fjingles%2Fuplifting%2FUplifting-1.mp3?alt=media&token=60b80935-4468-425a-9a1a-bf84d443d2e2';

	@ViewChild('controlsContainer')
	controlsContainer: ElementRef<HTMLElement> | undefined;

	@ViewChild('linearBar')
	linearBar: ElementRef<HTMLDivElement> | undefined;

	@ViewChild('image')
	image: ElementRef<HTMLImageElement> | undefined;

	playlist: Song[] = [];
	index: number;
	position = 0;
	duration = 0;
	private carlRSS = 'https://feeds.buzzsprout.com/159584.rss';
	defaultImage =
		'https://i.scdn.co/image/ab67706f00000003c414e7daf34690c9f983f76e';
	imageURL = '';

	constructor(public dialog: MatDialog, public bridge: PlayerBridgeService) {
		//
	}

	ngAfterViewInit() {
		if (this.image) {
		  this.bridge.playlist.asObservable().subscribe(playlist => {
		    if (playlist.length>0 && playlist[0].albumArt){
          const icon = this.image.nativeElement;
          this.imageURL = playlist[0].albumArt;
          icon.setAttribute('src', this.imageURL);
        } else {
          const icon = this.image.nativeElement;
          this.imageURL = this.defaultImage;
          icon.setAttribute('src', this.imageURL);
        }
		    this.playlist = playlist
      })
      this.bridge.index.asObservable().subscribe(index=>{
        this.index = index;
      })

      this.bridge.playing.asObservable().subscribe(value => {
        if (this.playlist.length>0 && this.playlist[this.index].image){
          const icon = this.image.nativeElement;
          this.imageURL = this.playlist[this.index].image;
          icon.setAttribute('src', this.imageURL);
        } else {
          const icon = this.image.nativeElement;
          this.imageURL = this.defaultImage;
          icon.setAttribute('src', this.imageURL);
        }
      })
		}
		if (this.linearBar) {
			this.linearBar.nativeElement.parentElement.addEventListener(
				'click',
				(event) => {
					const bcr = this.linearBar.nativeElement.parentElement.getBoundingClientRect();
					const percentage = (event.clientX - bcr.left) / bcr.width;
					this.bridge.seekPerPercentage(percentage);
				}
			);
			this.bridge.percentage.asObservable().subscribe(percentage => {
			  this.position = this.bridge.position.getValue()
        this.linearBar.nativeElement.style.width = (percentage * 100).toFixed(0) + '%';
      })
		}
	}

	onShuffle() {
		this.bridge.playerService.shuffle = true;
	}

	onRewind() {
		const e = new CustomEvent('jump', { detail: { jump: -15 } });
		this.bridge.seekForJump(e);
	}

	onPrev() {
		this.bridge.prev();
	}

	onPlay() {
		if (this.bridge.playing.getValue()) {
			this.bridge.pause({});
		} else {
			this.bridge.play();
		}
	}

	onNext() {
		this.bridge.next();
	}

	onLoop() {
		this.bridge.playerService.loop = true;
	}

	onForward() {
		const e = new CustomEvent('jump', { detail: { jump: 15 } });
		this.bridge.seekForJump(e);
	}

	openDialog() {
		const dialogRef = this.dialog.open(LoadDialogComponent, {
			width: '400px',
		});

		dialogRef.afterClosed().subscribe((result) => {
			console.log(result);
			if (result === 'default') {
				this.bridge.setPlaylistFromUrls([
					this.feedUrl,
					this.feedUrl,
					this.feedUrl,
				]);
			} else if (result === 'rss') {
				this.bridge.setPLaylistFromRSSFeedURL(this.carlRSS);
			} else {
				this.bridge.setPLaylistFromRSSFeedURL(result);
			}
		});
	}
	public secondsToFormat(timestamp: number) {
		const hours = Math.floor(timestamp / 60 / 60);
		const minutes = Math.floor(timestamp / 60) - hours * 60;
		const seconds = timestamp % 60;

		const formatted =
			hours.toFixed(0).padStart(2, '0') +
			':' +
			minutes.toFixed(0).padStart(2, '0') +
			':' +
			seconds.toFixed(0).padStart(2, '0');

		return formatted;
	}

	onVolume($event: MatSliderChange) {
		this.bridge.playerService.volume = $event.value / 100;
	}
}
