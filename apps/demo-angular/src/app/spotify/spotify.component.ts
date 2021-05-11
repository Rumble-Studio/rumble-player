import {
	AfterViewInit,
	Component,
	ElementRef,
	OnInit,
	ViewChild,
} from '@angular/core';
import { PlayerHTML, PlayerService } from '@rumble-player/player';
import { MatDialog } from '@angular/material/dialog';
import { LoadDialogComponent } from './load-dialog/load-dialog.component';
import { PlayerBridgeService } from './player-bridge.service';
import { MatSliderChange } from '@angular/material/slider';

@Component({
	selector: 'rumble-player-spotify',
	templateUrl: './spotify.component.html',
	styleUrls: ['./spotify.component.scss'],
})
export class SpotifyComponent implements OnInit, AfterViewInit {
	feedUrl =
		'https://firebasestorage.googleapis.com/v0/b/rumble-studio-alpha.appspot.com/o' +
		'/assets%2Faudio%2Fjingles%2Fuplifting%2FUplifting-1.mp3?alt=media&token=60b80935-4468-425a-9a1a-bf84d443d2e2';

	@ViewChild('controlsContainer')
	controlsContainer: ElementRef<HTMLElement> | undefined;

	@ViewChild('linearBar')
	linearBar: ElementRef<HTMLDivElement> | undefined;

	@ViewChild('image')
	image: ElementRef<HTMLImageElement> | undefined;

	position = 0;
	duration = 0;
	private carlRSS = 'https://feeds.buzzsprout.com/159584.rss';
	defaultImage =
		'https://i.scdn.co/image/ab67706f00000003c414e7daf34690c9f983f76e';
	imageURL = '';

	constructor(public dialog: MatDialog, public bridge: PlayerBridgeService) {
		//
	}

	ngOnInit(): void {
		this.bridge.playerHTML.setPlayerService(this.bridge.playerService);
	}
	ngAfterViewInit() {
		if (this.image) {
			this.bridge.playerHTML.addEventListener(
				'newPlaylist',
				(payload: CustomEvent) => {
					if (this.bridge.playerService.playlist[1].albumArt) {
						const icon = this.image.nativeElement;
						this.imageURL = this.bridge.playerService.playlist[1].albumArt;
						icon.setAttribute('src', this.imageURL);
					} else {
						const icon = this.image.nativeElement;
						this.imageURL = this.defaultImage;
						icon.setAttribute('src', this.imageURL);
					}
				}
			);

			this.bridge.playerHTML.addEventListener(
				'play',
				(payload: CustomEvent) => {
					if (
						this.bridge.playerService.playlist[
							this.bridge.playerService.index
						].image
					) {
						const icon = this.image.nativeElement;
						this.imageURL = this.bridge.playerService.playlist[
							this.bridge.playerService.index
						].image;
						icon.setAttribute('src', this.imageURL);
					} else {
						const icon = this.image.nativeElement;
						this.imageURL = this.defaultImage;
						icon.setAttribute('src', this.imageURL);
					}
				}
			);
		}
		if (this.linearBar) {
			this.linearBar.nativeElement.parentElement.addEventListener(
				'click',
				(event) => {
					const bcr = this.linearBar.nativeElement.parentElement.getBoundingClientRect();
					const percentage = (event.clientX - bcr.left) / bcr.width;
					this.bridge.playerHTML.seekPerPercentage(percentage);
				}
			);
			this.bridge.playerHTML.addEventListener(
				'newPosition',
				(payload: CustomEvent) => {
					const percentage = (payload.detail.percentage * 100).toFixed(0);
					this.linearBar.nativeElement.style.width = percentage + '%';
				}
			);
		}
	}

	onShuffle() {
		this.bridge.playerService.shuffle = true;
	}

	onRewind() {
		const e = new CustomEvent('jump', { detail: { jump: -15 } });
		this.bridge.playerHTML.seekForJump(e);
	}

	onPrev() {
		this.bridge.playerHTML.prev();
	}

	onPlay() {
		if (this.bridge.playerService.isPlaying) {
			this.bridge.playerHTML.pause({});
		} else {
			this.bridge.playerHTML.play({});
		}
	}

	onNext() {
		this.bridge.playerHTML.next();
	}

	onLoop() {
		this.bridge.playerService.loop = true;
	}

	onForward() {
		const e = new CustomEvent('jump', { detail: { jump: 15 } });
		this.bridge.playerHTML.seekForJump(e);
	}

	openDialog() {
		const dialogRef = this.dialog.open(LoadDialogComponent, {
			width: '400px',
		});

		dialogRef.afterClosed().subscribe((result) => {
			console.log(result);
			if (result === 'default') {
				this.bridge.playerService.setPlaylistFromUrls([
					this.feedUrl,
					this.feedUrl,
					this.feedUrl,
				]);
			} else if (result === 'rss') {
				this.bridge.playerService.setPLaylistFromRSSFeedURL(this.carlRSS);
			} else {
				this.bridge.playerService.setPLaylistFromRSSFeedURL(result);
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
