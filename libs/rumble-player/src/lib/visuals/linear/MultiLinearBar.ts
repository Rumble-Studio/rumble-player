import { GenericVisual } from '../../GenericVisual';
import { playerServiceEvent, RumblePlayerService } from '../../playerService';
import { HTMLRumblePlayer } from '../../playerHTML';

export class MultiLinearBar extends GenericVisual {
	protected _kind = 'MultiLinearBar';

	div: HTMLDivElement = document.createElement('div');
	percentage: number;
	maxDuration = 0;
	minDuration = Infinity;
	totalDuration = 0;
	styles: string[] = [];

	set playerHTML(player: HTMLRumblePlayer) {
		super.playerHTML = player;
		this.initView();
	}

	constructor() {
		super();
	}

	protected createHTMLElements() {
		const style = document.createElement('style');
		this.style.position = 'relative';
		this.style.backgroundColor = 'yellow';
		this.style.marginTop = '5px';
		this.style.marginBottom = '5px';
		this.list_of_children = [style];
	}

	protected setEmitters() {
		//
	}

	protected updateVisual(payload?) {
		// remplir à gauche de la tete de lecture et vider à droite de la tete
		console.log('checkpoint');
		// update sub linear bar based on percentage and index
		if (this.playerHTML) {
			const { index, percentage } = this.playerHTML;
			const bar = this._shadow.children.item(index + 1);
			const progressBar = bar.shadowRoot?.querySelector('style');
			if (progressBar) {
				progressBar.textContent = `
      #progressBar${index.toString()}{
        width: ${100 * percentage}%;
        background-color: white;
        opacity: 0.5;
        height:14px
      }`;
			}
		}
	}

	initView() {
		this.cleanShadow();
		let mainStyle = this.generateStyle();
		const style = document.createElement('style');
		this.shadowRoot.appendChild(style);
		const array = this.playerHTML.playlist;
		for (let index = 0; index < array.length; index++) {
			const value = array[index];
			const div = this.generateSingleBar(index, 50);
			div.shadowRoot.appendChild(document.createElement('style'));
			this.shadowRoot.appendChild(div);
			const tempStyle = `
      #bar${index.toString()}{
        width: ${100 / array.length}%;
        background-color: ${['red', 'green'][index % 2]};
        height:10px
      }
      `;
			mainStyle = mainStyle + tempStyle;
		}
		this._shadow.querySelector('style').textContent = mainStyle;
		this.list_of_children = [style];
		this.drawOnPreload();
	}

	drawOnPreload() {
		const style = document.createElement('style');
		const array = this.playerHTML.playlist;
		//let accumulatedWidth=0
		for (let index = 0; index < array.length; index++) {
			const song = array[index];
			let mainStyle = this.generateStyle();
			song.onload = (loadedSong) => {
				if (
					loadedSong.valid &&
					loadedSong.howl.duration() > this.maxDuration
				) {
					console.log('MAX DURATION', loadedSong.howl.duration());
					this.maxDuration = loadedSong.howl.duration();
				} else if (
					loadedSong.valid &&
					loadedSong.howl.duration() < this.minDuration
				) {
					console.log('MIN DURATION', loadedSong.howl.duration());
					this.minDuration = loadedSong.howl.duration();
				}
				if (loadedSong.valid) {
					console.log(loadedSong);
					this.totalDuration =
						this.totalDuration + loadedSong.howl.duration();
					const div = this.generateSingleBar(index, 50);
					const actualDuration = song.howl.duration();
					console.log(
						'DURATION PROCESS ACTUAL',
						actualDuration,
						(100 * actualDuration) / this.totalDuration
					);

					div.shadowRoot.appendChild(document.createElement('style'));
					this.shadowRoot.replaceChild(
						div,
						this.shadowRoot.querySelectorAll('div').item(index)
					);
					for (let i = 0; i < array.length; i++) {
						if (array[i].valid) {
							const actualDuration = array[i].howl.duration();

							//console.log('REMISE VALIDE',array[i],Math.floor(
							//(100 * actualDuration) / this.totalDuration
							//))
							const tempStyle = `
              #bar${i.toString()}{
                width: 150px;
                background-color: ${['red', 'green'][i % 2]};
                border: 1px solid blue;
                box-sizing: border-box;

                height:15px;
              }
              `;
							mainStyle = mainStyle + tempStyle;
							this._shadow.querySelector(
								'style'
							).textContent = mainStyle;
							this.list_of_children = [style];
						}
					}
					this._shadow.querySelector('style').textContent = mainStyle;
					this.list_of_children = [style];
				} else {
					console.log('LOADED NOT LOADED', loadedSong);
				}
			};
		}
	}

	cleanShadow() {
		this.shadowRoot.removeChild(this.shadowRoot.querySelector('style'));
		while (this.shadowRoot.querySelectorAll('div').length > 0) {
			this.shadowRoot.removeChild(this.shadowRoot.querySelector('div'));
		}
	}

	generateSingleBar(index: number, percentage: number) {
		const div = document.createElement('div');
		div.style.display = 'inline-block';
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
					finishOthers: false,
				},
			});
			this.dispatchEvent(clickEvent);
			this.updatePreviousOnTrackSeek(index);
		});
		return div;
	}

	protected setListeners() {
		this.playerHTML.addEventListener('newPlaylist', this.onPlaylist);
		this.playerHTML.addEventListener('next', this.onNext);
		this.playerHTML.addEventListener('prev', this.onPrev);
		this.playerHTML.addEventListener('stop', this.onStop);
		this.playerHTML.addEventListener('positionUpdate', () => {
			this.updateVisual();
		});
	}
	onPlaylist = (event) => {
		this.initView();
	};
	onNext = (event) => {
		this.updatePreviousOnTrackSeek(event.state.index);
	};
	onPrev = (event) => {
		this.updatePreviousOnTrackSeek(event.state.index);
	};
	onStop = (event) => {
		this.updatePreviousOnTrackSeek(0);
	};

	updatePreviousOnTrackSeek(index: number) {
		if (this.playerHTML) {
			if (index === 0) {
				const bar = this._shadow.children.item(1);
				const progressBar = bar.shadowRoot.querySelector('style');
				progressBar.textContent = `
        #progressBar${0}{
          width: 0%;
          background-color: white;
          opacity: 0.5;
          height:14px
        }`;
			}
			for (let i = 0; i < index; i++) {
				const bar = this._shadow.children.item(i + 1);
				const progressBar = bar.shadowRoot.querySelector('style');
				progressBar.textContent = `
        #progressBar${i.toString()}{
          width: 100%;
          background-color: white;
          opacity: 0.5;
          height:14px
        }`;
			}
			for (let i = index + 1; i < this.playerHTML.playlist.length; i++) {
				const bar = this._shadow.children.item(i + 1);
				const progressBar = bar.shadowRoot.querySelector('style');
				progressBar.textContent = `
        #progressBar${i.toString()}{
          width: 0%;
          background-color: white;
          opacity: 0.5;
          height:14px
        }`;
			}
		}
	}

	generateStyle(width?: number) {
		return `
		:host{
		  cursor:progress;
		  position:relative;
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
			margin-top:5px
			margin-bottom:5px
		}
		`;
	}
}

customElements.define('rs-multi-linear-bar', MultiLinearBar);
