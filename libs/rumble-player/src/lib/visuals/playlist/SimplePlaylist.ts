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

	protected setEmitters() {
		super.setEmitters();
	}

	updateContentVisual() {
		this.div.innerHTML = '';
		const p = document.createElement('p');
		p.innerText = this.playlistTitle;
		const ul = document.createElement('ul');
		this.div.appendChild(p);
		const infoMessage = document.createElement('p');
		infoMessage.style.fontWeight = 'bold';
		infoMessage.style.fontSize = 'large';
		if (this.playerHTML) {
			infoMessage.innerHTML =
				this.playerHTML.playlist.length === 0 ? 'Playlist empty' : '';
			this.div.appendChild(infoMessage);
			this.playerHTML.playlist.forEach((value, index, array) => {
				const line = this.generateLine(value, index, array.length);
				ul.appendChild(line);
			});
		} else {
			infoMessage.innerHTML = 'Playlist empty';
		}
		this.div.appendChild(ul);
		this.list_of_children[1] = this.div;
		super.setInnerHTML();
		this._shadow.querySelector('style').textContent = this.generateStyle();
		// this.progressDiv.style.width = 100 * this.percentage + 'px';
	}

	swapElements(oldIndex: number, newIndex: number) {
		//
	}

	generateLine(
		song: Song,
		index: number,
		total: number
	): HTMLDivElement | HTMLLIElement {
		// Each line of the playlist
		const div = document.createElement('div');

		// Each line of the playlist V2
		const li = document.createElement('li');

		const image = document.createElement('img');
		const noImage = document.createElement('p');
		//noImage.style.position='absolute'
		noImage.style.fontWeight = 'bold';
		if (song.image) {
			image.setAttribute('src', song.image);
		} else {
			noImage.innerHTML = '[NO IMAGE]';
		}
		image.style.maxHeight = '50px';
		const p = document.createElement('p');
		p.innerText =
			song.title +
			(song.valid == undefined
				? ' (false) '
				: ' (' + String(song.valid) + ')');
		if (index === this.playerHTML.index) {
			p.style.fontWeight = 'bold';
			p.innerHTML = song.title + ' (SELECTED)';
		}
		li.appendChild(p);

		const playButton = document.createElement('input');
		playButton.setAttribute('type', 'button');
		playButton.setAttribute('value', 'play');
		playButton.addEventListener('click', () => {
			if (song.valid) {
				const event = new CustomEvent('play', {
					detail: {
						index,
						stopOthers: true,
						keepPlaying: true,
						updateGlobalIndex: true,
						startSongAgain: false,
					},
				});
				this.playerHTML.processEventPlayRef(event);
			}
		});

		const pauseButton = document.createElement('input');
		pauseButton.setAttribute('type', 'button');
		pauseButton.setAttribute('value', 'pause');
		pauseButton.addEventListener('click', () => {
			if (song.valid) {
				this.playerHTML.processEventPauseRef(new CustomEvent('pause'));
			}
		});
		song.onload = (song: Song) => {
			const text = li.querySelector('p');

			text.innerHTML = song.title + '(' + song.valid + ')';
			if (index === this.playerHTML.index) {
				text.style.fontWeight = 'bold';
				text.innerHTML =
					song.title + ' (SELECTED)' + '(' + song.valid + ')';
			}
		};

		li.appendChild(noImage);
		li.appendChild(image);
		li.appendChild(playButton);
		li.appendChild(pauseButton);
		return li;
	}
	updateLine = (event?: playerServiceEvent) => {
		if (
			this.playerHTML.playlist.length <= 1 ||
			this.playerHTML.index === -1
		) {
			return;
		}
		this.playerHTML.playlist.forEach((song, index, array) => {
			const text = this.shadowRoot
				.querySelectorAll('li')
				.item(index)
				.querySelector('p');

			text.innerHTML = song.title + '(' + song.valid + ')';
			if (index === this.playerHTML.index) {
				text.style.fontWeight = 'bold';
				text.innerHTML =
					song.title + ' (SELECTED)' + '(' + song.valid + ')';
			}
		});
	};

	protected setListeners() {
		this.playerHTML.addEventListener('newPlaylist', this.onPlaylist);
		this.playerHTML.addEventListener('newIndex', () => {
			this.updateLine();
		});
	}
	onPlaylist = (event) => {
		this.updateContentVisual();
	};

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
