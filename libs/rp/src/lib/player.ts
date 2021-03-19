import { Howl, Howler } from 'howler';

export const EVENTLIST = [
	'seek',
	'play',
	'pause',
	'stop',
	'next',
	'previous',
	'indexChange',
];

export class RumblePlayer extends HTMLElement {
	public static observedAttributes = ['title'];
	playButton: HTMLButtonElement;
	pauseButton: HTMLButtonElement;
	stopButton: HTMLButtonElement;
	downloadButton: HTMLButtonElement;
	nextButton: HTMLButtonElement;
	prevButton: HTMLButtonElement;
	isPlaying = false;
	private _index: number;
	get index() {
		return this._index;
	}
	set index(value: number) {
		if (value != this._index) {
			console.log('index changed from ', this._index, ' ', value);
			this._index = value;
			const eventIndexChange = new CustomEvent('indexChange', {
				detail: value,
			});
			this.dispatchEvent(eventIndexChange);
			//this._updateAudioPlayerSrc();
		}
	}
	audio: HTMLAudioElement;
	private _playlist: Song[];

	constructor(title?: string) {
		super();
		this._playlist = [];
		this._index = -1;
		this.createHTMLChildren();
		this.bindHTMLElements();
		if (title) {
			this.title = title;
		}
	}
	connectedCallback() {
		this.addChildren();
	}
	getPlaylist() {
		return this._playlist;
	}
  getPlaylistAsString() {
    const songArray = [] as string[];
    this._playlist.forEach(value => {
      songArray.push(value.file)
    })
    return songArray
  }
	createHTMLChildren() {
		this.playButton = document.createElement('button');
		this.playButton.innerText = 'play';
		this.pauseButton = document.createElement('button');
		this.pauseButton.innerText = 'pause';
		this.stopButton = document.createElement('button');
		this.stopButton.innerText = 'stop';
		this.downloadButton = document.createElement('button');
		this.downloadButton.innerText = 'download';
		this.nextButton = document.createElement('button');
		this.nextButton.innerText = 'next';
		this.prevButton = document.createElement('button');
		this.prevButton.innerText = 'prev';
		this.audio = document.createElement('audio');
	}
	addChildren() {
		this.appendChild(this.playButton);
		this.appendChild(this.pauseButton);
		this.appendChild(this.stopButton);
		this.appendChild(this.downloadButton);
		this.appendChild(this.nextButton);
		this.appendChild(this.prevButton);
		this.appendChild(this.audio);
	}

	bindHTMLElements() {
		// Bind event to buttons
		this.playButton.addEventListener('click', () => {
			return this.play();
		});
		this.pauseButton.addEventListener('click', () => {
			return this.pause();
		});
		this.stopButton.addEventListener('click', () => {
			return this.stop();
		});
		this.downloadButton.addEventListener('click', () => {
			return this.download();
		});
		this.nextButton.addEventListener('click', () => {
			this.next();
		});
		this.prevButton.addEventListener('click', () => {
			this.prev();
		});

		// this.audio.onplay = () =>{
		//   this.isPlaying = true
		//   console.log('playing started', this.index ,this.audio.currentTime)
		//   const event = new CustomEvent('play',{detail:{index:this.index, position: this.audio.currentTime}})
		//   this.dispatchEvent(event)
		// }
		this.audio.onended = () => {
			this.next();
			// this.isPlaying = false
			// console.log('playing ended')
			// const event = new CustomEvent('stop',{detail:{index:this.index}})
			// this.dispatchEvent(event)
		};
		// this.audio.onpause = () =>{
		//   this.isPlaying = false
		//   console.log('playing paused')
		//   const event = new CustomEvent('pause',{detail:{index:this.index, position: this.audio.currentTime}})
		//   this.dispatchEvent(event)
		// }
	}
	getSeekingTime(): number {
		const data = this._playlist[this.index];
		if (!data.howl) {
			data.howl = new Howl({ src: data.file });
		}
		return data.howl.seek();
	}
	public play(): Promise<unknown> {
		if (this._playlist.length === 0) return;
		const data = this._playlist[this.index];
		if (!data.howl) {
			data.howl = new Howl({ src: data.file });
		}
		if (data.howl.playing()) return;
    data.howl.play();
    this.isPlaying = true;
    console.log(
      'playing started',
      this.index,
      'position : ' + data.howl.seek(),
      'duration : ' + data.howl.duration()
    );
    const event = new CustomEvent('play', {
      detail: {
        index: this.index,
        position: data.howl.seek(),
      },
    });
    this.dispatchEvent(event);

		return new Promise((resolve) => {
			resolve(true)
		}).catch((err) => {
			console.error('Error when asked to play', err);
			this.isPlaying = false;
		});
	}
	public pause() {
		if (this._playlist.length === 0) return;
		const data = this._playlist[this.index];
		if (!data.howl) {
			data.howl = new Howl({ src: data.file });
		}
		data.howl.pause();
		this.isPlaying = false;
		console.log(
			'playing paused',
			'position : ' + data.howl.seek(),
			'duration : ' + data.howl.duration()
		);
		const event = new CustomEvent('pause', {
			detail: {
				index: this.index,
				position: data.howl.seek(),
			},
		});
		this.dispatchEvent(event);
	}
	public stop() {
		if (this._playlist.length === 0) return;
		const data = this._playlist[this.index];
		if (!data.howl) {
			data.howl = new Howl({ src: data.file });
		}
		this.isPlaying = false;
		data.howl.stop();
	}
	private stopForMove() {
		// To stop the actual playing song  before moving to the next
		// Without affecting isPlaying
		const data = this._playlist[this.index];
		if (data.howl) {
			data.howl.stop();
		}
	}
	public next() {
		if (this._playlist.length === 0) return;
		this.stopForMove();
		if (this.index + 1 >= this._playlist.length) {
			this.index = 0;
		} else {
			this.index += 1;
		}
		const event = new CustomEvent('next', {
			detail: { index: this.index, playingState: this.isPlaying },
		});
		this.dispatchEvent(event);
		if (this.isPlaying) {
			this.play();
		}
	}
	public prev() {
		if (this._playlist.length === 0) return;
		const data = this._playlist[this.index];
		if (!data.howl) {
			data.howl = new Howl({ src: data.file });
		}
		if (data.howl.seek() >= 2) {
			this.seek(0);
			return;
		}
		this.stopForMove();
		if (this.index - 1 < 0) {
			this.index = this._playlist.length - 1;
		} else {
			this.index -= 1;
		}
		const event = new CustomEvent('previous', {
			detail: { index: this.index, playingState: this.isPlaying },
		});
		this.dispatchEvent(event);
		if (this.isPlaying) {
			this.play();
		}
	}
	public seek(position: number) {
		if (this._playlist.length === 0) return;
		// Move player head to a given time position(in seconds)
		const data = this._playlist[this.index];
		if (!data.howl) {
			data.howl = new Howl({ src: data.file });
		}
		data.howl.seek(position);
		const event = new CustomEvent('seek', {
			detail: { index: this.index, playingState: this.isPlaying, position },
		});
		this.dispatchEvent(event);
	}
	public setPlaylistFromString(playlist: string[]) {
		const songArray = [] as Song[];
		playlist.forEach((value) => {
			songArray.push({
				title: value.slice(0, 5),
				file: value,
				howl: new Howl({ src: value }),
			});
		});
		this.setPlaylist(songArray);
	}
	public setPlaylist(playlist: Song[]): void {
		// To accept several audio urls
		this.index = -1;
		this._playlist = playlist;
		this.index = this._playlist.length > 0 ? 0 : -1;
		this.stop();
	}

	private download() {
		return this.downloadUrl(
			this._playlist[this.index].file,
			'rs-player-file.mp3',
			'audio/*'
		);
	}

	async downloadUrl(url: string, filename: string, mimeType: string) {
		this.downloadFile(await this.urlToFile(url, filename, mimeType));
	}
	urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
		return fetch(url)
			.then(function (res) {
				return res.arrayBuffer();
			})
			.then(function (buf) {
				return new File([buf], filename, { type: mimeType });
			});
	}
	downloadFile(file: File) {
		// Convert your blob into a Blob URL (a special url that points to an object in the browser’s memory)
		const blobUrl = URL.createObjectURL(file);
		// Create a link element
		const link = document.createElement('a');
		// Set link’s href to point to the Blob URL
		link.href = blobUrl;
		link.download = file.name;
		// Append link to the body
		document.body.appendChild(link);
		// Dispatch click event on the link
		// This is necessary as link.click() does not work on the latest firefox
		link.dispatchEvent(
			new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				view: window,
			})
		);
		// Remove link from body
		document.body.removeChild(link);
	}
}

customElements.define('rs-player', RumblePlayer);

interface Song {
	title: string;
	file: string;
	howl: Howl | null;
}
