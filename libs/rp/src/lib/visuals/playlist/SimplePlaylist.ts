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
		const ul = document.createElement('ul');
		this.div.appendChild(p);
    console.log('LES ELEMENTS',this._playlist)
		this.playerService.playlist.forEach((value, index, array) => {

			const line = this.generateLine(value, index, array.length);
			ul.appendChild(line);
		});
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
		if (index === this._playerService.index) {
			p.style.fontWeight = 'bold';
			p.innerHTML = song.title + ' (SELECTED)';
		}

		const playButton = document.createElement('input');
		playButton.setAttribute('type', 'button');
		playButton.setAttribute('value', 'play');
		playButton.addEventListener('click', () => {
			if (song.valid) {
				//this._playerService.pause();
				//this._playerService.play(index).then((r) => {
					//
				//});
				const event = new CustomEvent('play',{
				  detail: {
            index,
            stopOthers:true,
            updateGlobalIndex:true,
            resetPosition:true
          }
        })
        this.dispatchEvent(event)
			}
		});

		const pauseButton = document.createElement('input');
		pauseButton.setAttribute('type', 'button');
		pauseButton.setAttribute('value', 'pause');
		pauseButton.addEventListener('click', () => {
			if (song.valid) {
				this._playerService.pause();
			}
		});
		song.onload = (song: Song) => {
			const text = div.querySelector('p');

			text.innerHTML = song.title + '(' + song.valid + ')';
		};
		li.appendChild(p);
		li.appendChild(noImage);
		li.appendChild(image);
		li.appendChild(playButton);
		li.appendChild(pauseButton);
		return li;
	}

	protected updateState(state: playerServiceEvent) {
		if (state.type === 'newPlaylist') {
			this.updateContentVisual();
		}
		if (state.type === 'play') {
			console.log('PLAYED');
			this.updateContentVisual();
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

// generateLine(song: Song, index: number, total: number): HTMLDivElement | HTMLLIElement {
//   // Each line of the playlist
//   const div = document.createElement('div');
//   div.style.display = 'flex';
//   div.style.flexDirection = 'row';
//   div.style.alignItems = 'center';
//   div.style.justifyContent = 'space-between';
//   div.style.border = '1px solid blue';
//   div.style.width = '90%';
//   div.style.height = '100px';
//
//   // Each line of the playlist V2
//   const li = document.createElement('li');
//   li.draggable = true
//   li.ondragover = (ev) => ev.preventDefault();
//   li.ondragstart = (e) => {
//     const startC = e.clientY;
//     const startP = e.clientY;
//     const shiftY =
//       e.clientY - li.parentElement.getBoundingClientRect().top;
//     li.ondragend = (ev) => {
//       const newTop =
//         ev.clientY - li.parentElement.getBoundingClientRect().top;
//       const minTop = Math.max(1, newTop);
//       const maxTop = Math.min(minTop, total * li.scrollHeight);
//       const finalIndex = Math.floor(maxTop / li.scrollHeight);
//       console.log(ev.clientY - startC, maxTop, finalIndex);
//     };
//   };
//
//   // Dragging feature
//   div.draggable = true;
//
//   div.ondragover = (ev) => ev.preventDefault();
//   div.ondragstart = (e) => {
//     const startC = e.clientY;
//     const startP = e.clientY;
//     const shiftY =
//       e.clientY - div.parentElement.getBoundingClientRect().top;
//     div.ondragend = (ev) => {
//       const newTop =
//         ev.clientY - div.parentElement.getBoundingClientRect().top;
//       const minTop = Math.max(1, newTop);
//       const maxTop = Math.min(minTop, total * div.scrollHeight);
//       const finalIndex = Math.floor(maxTop / div.scrollHeight);
//       console.log(ev.clientY - startC, maxTop, finalIndex);
//     };
//   };
//
//   const image = document.createElement('img');
//   image.setAttribute('src', song.image);
//   image.style.maxHeight = '50px';
//   const p = document.createElement('p');
//   p.innerText =
//     song.title +
//     (song.valid == undefined
//       ? ' (false) '
//       : ' (' + String(song.valid) + ')');
//   if (index === this._playerService.index) {
//     p.style.fontWeight = 'bold';
//     p.innerHTML = song.title + ' (SELECTED)';
//   }
//
//   song.onload = (song: Song) => {
//     const text = div.querySelector('p');
//
//     text.innerHTML = song.title + '(' + song.valid + ')';
//   };
//   li.appendChild(p);
//   const playButton = document.createElement('input');
//   playButton.setAttribute('type', 'button');
//   playButton.setAttribute('value', 'play');
//   playButton.addEventListener('click', () => {
//     this._playerService.play(index).then((r) => {
//       //
//     });
//   });
//
//   const pauseButton = document.createElement('input');
//   pauseButton.setAttribute('type', 'button');
//   pauseButton.setAttribute('value', 'pause');
//   pauseButton.addEventListener('click', () => {
//     this._playerService.pause(index);
//   });
//   li.appendChild(image);
//   li.appendChild(playButton);
//   li.appendChild(pauseButton);
//   return li;
// }
