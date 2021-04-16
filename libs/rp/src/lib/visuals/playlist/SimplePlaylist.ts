import { GenericVisual } from '../../GenericVisual';
import { Song } from '@rumble-player/rp';

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
		this._playlist.forEach((value, index) => {
			const line = this.generateLine(value, index);
			this.div.appendChild(line);
		});
		this.list_of_children[1] = this.div;
		super.setInnerHTML();
		this._shadow.querySelector('style').textContent = this.generateStyle();
		// this.progressDiv.style.width = 100 * this.percentage + 'px';
	}
	generateLine(song: Song, index: number): HTMLDivElement {
		// Each line of the playlist
		const div = document.createElement('div');
		div.style.display = 'flex';
		div.style.flexDirection = 'row';
		div.style.justifyContent = 'space-between';
		div.style.border = '1px solid blue';
		div.style.width = '90%';
		div.style.minHeight = '20px';

		// Dragging feature
    div.draggable = true
    div.ondragover = (ev => {ev.preventDefault()})
    


		const p = document.createElement('p');
		p.innerText = song.title;
		div.appendChild(p);
		const playButton = document.createElement('input');
		playButton.setAttribute('type', 'button');
		playButton.setAttribute('value', 'play');
		playButton.addEventListener('click', () => {
			console.log('Trying to play', index);
			this._playerService.play(index).then((r) => {
				//
			});
		});

		const pauseButton = document.createElement('input');
		pauseButton.setAttribute('type', 'button');
		pauseButton.setAttribute('value', 'pause');
		pauseButton.addEventListener('click', () => {
			console.log('Trying to pause', index);
			this._playerService.pause(index);
		});
		div.appendChild(playButton);
		div.appendChild(pauseButton);
		console.log('LINE', div);
		return div;
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
