import { GenericVisual } from '../../GenericVisual';
import { RumblePlayerService } from '../../playerService';

export class MultiLinearBar extends GenericVisual {
	protected _kind = 'MultiLinearBar';

	div: HTMLDivElement = document.createElement('div');
	percentage: number;
	maxDuration = 0;
	styles: string[] = [];

	set playerService(player: RumblePlayerService) {
		super.playerService = player;
		this.div.innerHTML = '';
		let mainStyle = this.generateStyle();
		const style = document.createElement('style');
		this.div.setAttribute('id', 'bar');
		player.playlist.forEach((value, index, array) => {
			const div = this.generateSingleBar(index, 50);
			div.shadowRoot.appendChild(document.createElement('style'));
			this.shadowRoot.appendChild(div);
			const tempStyle = `
      #bar${index.toString()}{
        width: ${100 / array.length}%;
        background-color: ${['red', 'green'][index % 2]};
        border-width:1px;
        border-color:${['red', 'green'][index % 2]};
        position:relative;
        display:inline-block;
        height:15px
      }
      `;
			mainStyle = mainStyle + tempStyle;
		});
		this._shadow.querySelector('style').textContent = mainStyle;
		this.list_of_children = [style];

		this.drawOnPreload(player);
	}

	constructor() {
		super();
	}
	async drawOnPreload(player) {
		const p = player.preloadPlaylist();
		console.log('ALL LOADED', p);
		await Promise.all(p)
			.then((r) => console.log('ALL LOADED'))
			.catch((er) => {
				console.error(er);
			});
		console.log('ALL LOADED');
		let mainStyle = this.generateStyle();
		this.div.innerHTML = '';
		const style = document.createElement('style');
		this.div.setAttribute('id', 'bar');

		let maxDuration = 0;
		let totalDuration = 0;
		player.playlist.forEach((value) => {
			if (value.valid) {
				totalDuration = totalDuration + value.howl.duration();
			}
			if (value.valid && value.howl.duration() > maxDuration) {
				console.log('MAX DURATION', value.howl.duration());
				maxDuration = value.howl.duration();
			}
		});
		console.log('DURATION PROCESS TOTAL', totalDuration);
		player.playlist.forEach((value, index, array) => {
			const div = this.generateSingleBar(index, 50);
			const actualDuration = value.valid ? value.howl.duration() : 0;
			console.log(
				'DURATION PROCESS ACTUAL',
				actualDuration,
				(100 * actualDuration) / totalDuration
			);

			div.shadowRoot.appendChild(document.createElement('style'));
			this.shadowRoot.replaceChild(
				div,
				this.shadowRoot.querySelectorAll('div').item(index)
			);
			const tempStyle = `
      #bar${index.toString()}{
        width: ${(100 * actualDuration) / totalDuration}%;
        background-color: ${['red', 'green'][index % 2]};
        border-width:1px;
        border-color:${['red', 'green'][index % 2]};
        position:relative;
        display:inline-block;
        height:15px
      }
      `;
			mainStyle = mainStyle + tempStyle;
		});
		this._shadow.querySelector('style').textContent = mainStyle;
		this.list_of_children = [style];
	}

	protected createHTMLElements() {
		const style = document.createElement('style');
		this.div = document.createElement('div');
		this.div.setAttribute('id', 'bar');

		this.list_of_children = [style];
	}

	protected bindHTMLElements() {
		//
	}
	generateSingleBar = (index: number, percentage: number) => {
		const div = document.createElement('div');
		div.attachShadow({ mode: 'open' });
		div.setAttribute('id', 'bar' + index.toString());
		const progressDiv = document.createElement('div');
		progressDiv.attachShadow({ mode: 'open' });
		progressDiv.setAttribute('id', 'progressBar' + index.toString());

		div.shadowRoot.appendChild(progressDiv);
		div.style.cursor = 'pointer';
		div.addEventListener('click', (event) => {
			const bcr = div.getBoundingClientRect();
			const percentage = (event.clientX - bcr.left) / bcr.width;
			const clickEvent = new CustomEvent('seekPerPercentageAndIndex', {
				detail: {
					percentage,
					index,
					stopOthers: true,
					keepPlaying: true,
					updateGlobalIndex: true,
				},
			});
			this.dispatchEvent(clickEvent);
		});
		return div;
	};

	updateVisual() {
		if (this._playerService) {
			const { index, percentage } = this._playerService;
			const bar = this._shadow.children.item(index + 1);
			const progressBar = bar.shadowRoot.querySelector('style');
			progressBar.textContent = `
      #progressBar${index.toString()}{
        width: ${100 * percentage}%;
        background-color: white;
        height:14px
      }`;
		}
	}

	generateStyle() {
		return `
		#bar{
			height:15px;
			position:relative;
			background-color: green;
			cursor:pointer;
		}
		`;
	}
	generateProgressStyle(percentage: number, index: number) {
		return `
		#progressBar${index}{
			height:15px;
			width: ${100 * percentage}%;
    	position:relative;
			background-color: blue;
			cursor:pointer;
		}
		`;
	}
}

customElements.define('rs-multi-linear-bar', MultiLinearBar);
