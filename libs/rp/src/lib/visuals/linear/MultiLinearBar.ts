import { GenericVisual } from '../../GenericVisual';
import { playerServiceEvent, RumblePlayerService } from '../../playerService';

export class MultiLinearBar extends GenericVisual {
	protected _kind = 'MultiLinearBar';

	div: HTMLDivElement = document.createElement('div');
	percentage: number;
	maxDuration = 0;
	totalDuration = 0;
	styles: string[] = [];

	set playerService(player: RumblePlayerService) {
		super.playerService = player;
		this.initView()
	}

	constructor() {
		super();
	}
	initView(){
    this.cleanShadow()
    this.div.innerHTML = '';
    let mainStyle = this.generateStyle();
    const style = document.createElement('style');
    this.div.setAttribute('id', 'bar');
    this._playerService.playlist.forEach((value, index, array) => {
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
    this._playerService.preloadPlaylist();
    this.drawOnPreload();
  }
	drawOnPreload() {

		this.div.innerHTML = '';
		const style = document.createElement('style');
		this.div.setAttribute('id', 'bar');


		this._playerService.playlist.forEach((song,index,array) => {
      let mainStyle = this.generateStyle();
		  song.onload=(loadedSong)=>{

        if (loadedSong.valid && loadedSong.howl.duration() > this.maxDuration) {
          console.log('MAX DURATION', loadedSong.howl.duration());
          this.maxDuration = loadedSong.howl.duration();
        }
        if (loadedSong.valid) {
          console.log(loadedSong)
          this.totalDuration = this.totalDuration + loadedSong.howl.duration();
          const div = this.generateSingleBar(index, 50);
          const actualDuration = song.valid ? song.howl.duration() : 0;
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
          for (let i = 0; i < index; i++) {
            if(array[i].valid){
              const actualDuration = array[i].howl.duration();
              const tempStyle = `
              #bar${i.toString()}{
                width: ${Math.floor((100 * actualDuration) / this.totalDuration)}%;
                background-color: ${['red', 'green'][i % 2]};
                border: 1px solid blue;
                box-sizing: border-box;
                position:relative;
                display:inline-block;
                height:15px
              }
              `;
              mainStyle = mainStyle + tempStyle;
              this._shadow.querySelector('style').textContent = mainStyle;
              this.list_of_children = [style];
            }
          }
          if(song.valid ){
            const tempStyle = `
            #bar${index.toString()}{
              width: ${Math.floor((100 * actualDuration) / this.totalDuration)}%;
              background-color: ${['red', 'green'][index % 2]};
              box-sizing: border-box;
              position:relative;
              display:inline-block;
              height:15px
            }
            `;
            mainStyle = mainStyle + tempStyle;
            this._shadow.querySelector('style').textContent = mainStyle;
            this.list_of_children = [style];
          }
        }
      }

		});
		console.log('DURATION PROCESS TOTAL', this.totalDuration,this.shadowRoot);

	}

	cleanShadow(){
    const shadowLength = this.shadowRoot.children.length
    const elt = Array.from(this.shadowRoot.children)
    for (let i=0; i < length; i++) {
      this.shadowRoot.removeChild(elt[i])
    }
    console.log('SHADOW IS',this.shadowRoot)
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
  protected updateState(state: playerServiceEvent) {
    if (state.type === 'newPlaylist') {
      //this.initView()
    }
  }

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
