import {
	AfterViewInit,
	Component,
	ElementRef,
	HostListener,
	Input,
	OnInit,
	ViewChild,
} from '@angular/core';
import { PlayerBridgeService } from '../player-bridge.service';

@Component({
	selector: 'rumble-player-control',
	templateUrl: './control.component.html',
	styleUrls: ['./control.component.scss'],
})
export class ControlComponent implements AfterViewInit {
	@Input() icon;
	@Input() task;
	@Input() additionalClass;

	enabled = false;
	btn = 'play_outline_circle';
	pause = true;

	@ViewChild('container')
	container: ElementRef<HTMLDivElement> | undefined;

	constructor(public bridge: PlayerBridgeService) {
		//
	}

	@HostListener('click', [])
	onClick() {
		console.log('clicked');
		if (this.task === 'loop') {
			if (this.bridge.playerService.loop) {
				this.bridge.playerService.loop = false;
				this.enabled = false;
			} else {
				this.bridge.playerService.loop = true;
				this.enabled = true;
			}
		} else if (this.task === 'shuffle') {
			if (this.bridge.playerService.shuffle) {
				this.bridge.playerService.shuffle = false;
				this.enabled = false;
			} else {
				this.bridge.playerService.shuffle = true;
				this.enabled = true;
			}
		}
		this.setup();
	}

	ngAfterViewInit() {
		this.setup();
	}

	setup() {
		if (this.container) {
			const icon = this.container.nativeElement.children.item(0);
			icon.innerHTML = this.icon;
			if (this.additionalClass) {
				icon.classList.add(this.additionalClass);
			}
			if (this.task === 'play') {
			  this.bridge.playing.asObservable().subscribe(next => {
			    if (next){
            this.changeIcon('pause_circle_outline');
          } else {
            this.changeIcon('play_circle_outline');
          }
        })
			}
		}
	}

	private changeIcon(value: string) {
		this.icon = value;
		const icon = this.container.nativeElement.children.item(0);
		icon.innerHTML = this.icon;
	}
}
