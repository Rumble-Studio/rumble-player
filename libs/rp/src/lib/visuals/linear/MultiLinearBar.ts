import { GenericVisual } from '../../GenericVisual';
import { playerServiceEvent, RumblePlayerService } from '../../playerService';

export class MultiLinearBar extends GenericVisual {
	protected _kind = 'MultiLinearBar';

	div: HTMLDivElement = document.createElement('div');
	percentage: number;
	maxDuration = 0;
	minDuration = Infinity;
	totalDuration = 0;
	styles: string[] = [];

	set playerService(player: RumblePlayerService) {
		super.playerService = player;
		this.initView();
	}

	constructor() {
		super();
		this.style.position = 'relative'
		this.style.backgroundColor='yellow'
    //this.style.minWidth = '100%'
		this.style.overflow='scroll'
	}
	initView() {
		this.cleanShadow();
		let mainStyle = this.generateStyle();
		const style = document.createElement('style');
		this.shadowRoot.appendChild(style);
		const array = this._playerService.playlist;
		for (let index = 0; index < array.length; index++) {
			const value = array[index];
			const div = this.generateSingleBar(index, 50);
			div.shadowRoot.appendChild(document.createElement('style'));
			this.shadowRoot.appendChild(div);
			const tempStyle = `
      #bar${index.toString()}{
        width: ${100 / array.length}%;
        background-color: ${['red', 'green'][index % 2]};
        border-width:1px;
        border-color:${['red', 'green'][index % 2]};

        height:15px
      }
      `;
			mainStyle = mainStyle + tempStyle;
			//console.log('STYLING', mainStyle);
		}
		this._shadow.querySelector('style').textContent = mainStyle;
		this.list_of_children = [style];
		this._playerService.preloadPlaylist();
		this.drawOnPreload();
	}
	drawOnPreload() {
		const style = document.createElement('style');
		const array = this._playerService.playlist;
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
				}
				else if (
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
						else{
						  //console.log('REMISE INVALIDE',array[i])
            }
					}
					// if (song.valid) {
					//   const tempStyle = `
					//   #bar${index.toString()}{
					//     flex: ${Math.floor(
					//     (100 * actualDuration) / this.totalDuration
					//   )}px;
					//     background-color: ${['red', 'green'][index % 2]};
					//     box-sizing: border-box;
					//     position:relative;
					//     display:inline-block;
					//     height:15px
					//   }
					//   `;
					//   mainStyle = mainStyle + tempStyle;
					//   this._shadow.querySelector('style').textContent = mainStyle;
					//   this.list_of_children = [style];
					// }
					//mainStyle = mainStyle + tempStyle;
					this._shadow.querySelector('style').textContent = mainStyle;
					this.list_of_children = [style];
				} else {
					console.log('LOADED NOT LOADED', loadedSong);
				}
			};
		}
		console.log(
			'DURATION PROCESS TOTAL',
			this.totalDuration,
			this.shadowRoot
		);
	}

	cleanShadow() {
		// const shadowLength = this.shadowRoot.children.length;
		// const elt = Array.from(this.shadowRoot.children);
		// for (let i = 0; i < length; i++) {
		// 	this.shadowRoot.removeChild(elt[i]);
		// }
		// console.log('SHADOW IS', this.shadowRoot);
		this.shadowRoot.removeChild(this.shadowRoot.querySelector('style'));
		while (this.shadowRoot.querySelectorAll('div').length > 0) {
			this.shadowRoot.removeChild(this.shadowRoot.querySelector('div'));
		}
	}

	protected createHTMLElements() {
		const style = document.createElement('style');
		this.style.marginTop = '5px';
		this.style.marginBottom = '5px';
		this.style.overflow = 'scroll';
		this.list_of_children = [style];
	}

	protected bindHTMLElements() {
		//
	}
	generateSingleBar = (index: number, percentage: number) => {
		const div = document.createElement('div');
		div.style.display = 'inline-block'
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
	};
	protected updateState(state: playerServiceEvent) {
		if (state.type === 'newPlaylist') {
			this.initView();
		}
    if (state.type === 'next') {
      this.updatePreviousOnTrackSeek(state.state.index);
    }
    if (state.type === 'prev') {
      this.updatePreviousOnTrackSeek(state.state.index);
    }
    if (state.type === 'stop') {
      this.updatePreviousOnTrackSeek(0);
    }
	}

	updateVisual() {
		if (this._playerService) {
			const { index, percentage } = this._playerService;
			const bar = this._shadow.children.item(index + 1);
			const progressBar = bar.shadowRoot?.querySelector('style');
			if(progressBar){
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
	updatePreviousOnTrackSeek(index: number) {
		if (this._playerService) {
		  if (index===0){
        const bar = this._shadow.children.item( 1);
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
			for (let i = index + 1; i < this._playerService.playlist.length; i++) {
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

	generateStyle(width?:number) {
		return `
		:host{
		  width:900px
		  overflow: scroll;
		  background-color: black;
		  display:block;
		  cursor:progress;
		  position:relative;
		  height:15px
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
/*
${actualDuration===this.minDuration?'100px':String(Math.floor(
                (100*(actualDuration / this.minDuration))) +
 */
