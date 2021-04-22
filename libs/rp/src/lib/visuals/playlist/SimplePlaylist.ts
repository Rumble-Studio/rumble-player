import { GenericVisual } from '../../GenericVisual';
import { playerServiceEvent, Song } from '../../playerService';

export class SimplePlaylist extends GenericVisual {
	protected _kind = 'SimplePlaylist';

	div: HTMLDivElement = document.createElement('div');
	private _playlist: Song[] = [];
	set playlist(playlist: Song[]) {
		this._playlist = playlist;
		this.updateContentVisual();
	}
	get playlist() {
		return this._playlist;
	}

	constructor(private playlistTitle = 'RS Playlist') {
		super();
	}

	protected createHTMLElements() {
		super.createHTMLElements();
		this.div = document.createElement('div');
		const style = document.createElement('style');
		this.div.setAttribute('id', 'container');

		this.list_of_children = [style, this.div];
	}

	protected bindHTMLElements() {
		super.bindHTMLElements();
	}

	updateContentVisual() {
		this.div.innerHTML = '';
		const p = document.createElement('p');
		p.innerText = this.playlistTitle;
		this.div.appendChild(p);
		this._playlist.forEach((value, index, array) => {
			const line = this.generateLine(value, index, array.length);
			this.div.appendChild(line);
		});
		this.list_of_children[1] = this.div;
		super.setInnerHTML();
		this._shadow.querySelector('style').textContent = this.generateStyle();
		// this.progressDiv.style.width = 100 * this.percentage + 'px';
	}

	swapElements(oldIndex: number, newIndex: number) {
		//
	}

	generateLine(song: Song, index: number, total: number): HTMLDivElement {
		// Each line of the playlist
		const div = document.createElement('div');
		div.style.display = 'flex';
		div.style.flexDirection = 'row';
		div.style.alignItems = 'center';
		div.style.justifyContent = 'space-between';
		div.style.border = '1px solid blue';
		div.style.width = '90%';
		div.style.height = '30px';

		// Dragging feature
		div.draggable = true;

		div.ondragover = (ev) => ev.preventDefault();
		div.ondragstart = (e) => {
			const startC = e.clientY;
			const startP = e.clientY;
			const shiftY =
				e.clientY - div.parentElement.getBoundingClientRect().top;
			div.ondragend = (ev) => {
				const newTop =
					ev.clientY - div.parentElement.getBoundingClientRect().top;
				const minTop = Math.max(1, newTop);
				const maxTop = Math.min(minTop, total * div.scrollHeight);
				const finalIndex = Math.floor(maxTop / div.scrollHeight);
				console.log(ev.clientY - startC, maxTop, finalIndex);
			};
		};

		const p = document.createElement('p');
		p.innerText = song.title + '(false)';
		song.onload=(song:Song)=>{
		  const text = div.querySelector('p')
      text.innerHTML = song.title + '('+song.valid+')'
    }
		div.appendChild(p);
		const playButton = document.createElement('input');
		playButton.setAttribute('type', 'button');
		playButton.setAttribute('value', 'play');
		playButton.addEventListener('click', () => {
			this._playerService.play(index).then((r) => {
				//
			});
		});

		const pauseButton = document.createElement('input');
		pauseButton.setAttribute('type', 'button');
		pauseButton.setAttribute('value', 'pause');
		pauseButton.addEventListener('click', () => {
			this._playerService.pause(index);
		});
		div.appendChild(playButton);
		div.appendChild(pauseButton);
		return div;
	}

  protected updateState(state: playerServiceEvent) {
    if (state.type === 'newPlaylist') {
      this.updateContentVisual()
    }
  }

  generateStyle() {
		return `
		#container{
			width:90%;
			background-color:red;
			position:relative;
			display: flex;
			flex-direction:column;
		}
`;
	}
}

class SongLine extends HTMLElement {
	private playButton: HTMLInputElement;
	private pauseButton: HTMLInputElement;
	static get observedAttributes() {
		return ['disabled', 'index'];
	}
	get disabled() {
		return this.hasAttribute('disabled');
	}

	set disabled(val) {
		if (val) {
			this.setAttribute('disabled', '');
		} else {
			this.removeAttribute('disabled');
		}
	}

	constructor() {
		super();
	}
}

customElements.define('rs-simple-playlist', SimplePlaylist);
