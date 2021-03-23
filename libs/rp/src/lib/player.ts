import { Howl } from 'howler';
import { v4 as uuidv4 } from 'uuid';
import { LinearSeekBar } from './seekbar';

export const EVENTLIST = [
	'seek',
	'play',
	'pause',
	'stop',
	'next',
	'previous',
	'indexChange',
];

export const UPDATE_DELAY = 100;

interface Song {
	id: string; // unique id to identify the song even when we add new song to the playlist
	title: string;
	file: string;
	howl: Howl | null;
	position?: number | null; // current seeking of position of the howl
}

interface Layout {
	// from input
	nbRows: number;
	nbColumns: number;

	// computed
}

function downloadFile(file: File) {
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
async function urlToFile(
	url: string,
	filename: string,
	mimeType: string
): Promise<File> {
	const res = await fetch(url);
	const buf = await res.arrayBuffer();
	return new File([buf], filename, { type: mimeType });
}

export class RumblePlayer extends HTMLElement {
	autoPlayNext = true; // do we play automatically next song

	isPlaying = false;
	private progressCallback: number;
	playingOn() {
		this.isPlaying = true;
	}
	playingOff() {
		this.isPlaying = false;
	}

	// index in playlist
	private _index: number;
	get index() {
		return this._index;
	}
	set index(value: number) {
		if (value != this._index) {
			this._index = value;
			const eventIndexChange = new CustomEvent('indexChange', {
				detail: value,
			});
			this.dispatchEvent(eventIndexChange);
			// if (value >= 0){
			//   this.playlist[value].howl.onload = function () {
			//     console.log('Song loaded index ', value);
			//   }
			// }
		}
	}

	// playlist
	private _playlist: Song[];
	get playlist() {
		return this._playlist;
	}
	set playlist(playlist: Song[]) {
		this.stop(); // stop before doing anything else
		this._playlist = playlist;
		this.index = this._playlist.length > 0 ? 0 : -1;
		const eventIndexChange = new CustomEvent('newPlaylist', {
			detail: playlist.length,
		});
		this.dispatchEvent(eventIndexChange);
	}

	// seekbar
	private _seekbar: LinearSeekBar;
	// seekbar progress
	// current position
	private _position: number;
	get position() {
		return this._position;
	}
	set position(value: number) {
		this._position = value;
	}
	private customButtons: string[] = []

	constructor(customButtons?: string[]) {
		super();
		this._playlist = [];
		this._index = -1;
		this._position = 0;
		this.createHTMLChildren();
		this.bindHTMLElements();
		this.customButtons = customButtons

		setInterval(() => {
			this.updatePositions();
		}, UPDATE_DELAY);
		this.progressCallback = setInterval(() => {
			this.updateProgress();
		}, 300);
	}

	// getPlaylistAsString() {
	// 	const songArray = [] as string[];
	// 	this._playlist.forEach((value) => {
	// 		songArray.push(value.file);
	// 	});
	// 	return songArray;
	// }

	getRank(song: Song) {
		return this._playlist.map((s) => s.id).indexOf(song.id);
	}
	updateProgress() {
		if (this.playlist[this.index].howl) {
			const howl = this.playlist[this.index].howl;
			const percentage = (100 * howl.seek()) / howl.duration();
			console.log(
				'%cUPDATING PROGRESS',
				'color:blue',
				percentage,
				howl.seek(),
				howl.duration()
			);
			if (!isNaN(percentage)) {
				this._seekbar.setBarProgression(percentage);
			}
		}
	}

	updatePositions() {
		if (this._playlist.length === 0) return;

		this._playlist.forEach((song: Song, songIndex: number) => {
			if (song.howl) {
				song.position = song.howl.seek() as number;
			} else {
				song.position = -1;
			}
		});

		this.position = this.playlist[this.index].position;
	}

	createHowlWithBindings(song: Song) {
		const howl = new Howl({
			src: [song.file],
			onplayerror: (error) => {
				console.log('error howler playing', error);
				this.playingOff();
			},
			onload: () => {
				console.log('Song loaded, duration is ', song.howl.duration());
				this._seekbar.setTotalDuration(song.howl.duration());
			},
			onloaderror: (error) => {
				console.log('error howler loading', error);
				this.playingOff();
			},
			onend: () => {
				console.log('%cend.', 'color:cyan');
				console.log(
					'%cBLA%cBLI%cBLOU.',
					'color:blue',
					'color:white',
					'color:red'
				);
				if (this.autoPlayNext) this.next();
				else {
					this.stop();
				}
			},
			onpause: () => {
				console.log('%cpause.', 'color:cyan');
				const event = new CustomEvent('pause', {
					detail: {
						index: this.getRank(song),
						position: song.howl.seek(),
					},
				});
				this.dispatchEvent(event);
				this.playingOff();
			},
			onplay: () => {
				console.log('%cplay.', 'color:cyan');
				const event = new CustomEvent('play', {
					detail: {
						index: this.getRank(song),
						position: song.howl.seek(),
					},
				});
				this.dispatchEvent(event);
				this.playingOn();
			},
			onseek: () => {
				const event = new CustomEvent('seek', {
					detail: {
						index: this.getRank(song),
						position: song.howl.seek(),
					},
				});
				this.dispatchEvent(event);
				console.log('%cseek.', 'color:cyan');
			},
		});
		return howl;
	}

	// should return as a promise the current index asked to be played
	public play(index?: number): Promise<number> {
		// if no playlist index is -1
		if (this._playlist.length === 0) return Promise.resolve(-1);

		const indexToPlay = index || this.index;

		console.log('Asked to play:', indexToPlay);

		// Check howl instance to play
		const song = this._playlist[indexToPlay];
		if (!song.howl) {
			song.howl = this.createHowlWithBindings(song);
		}
		// Check if howl is already playing
		if (song.howl.playing()) {
			return Promise.resolve(indexToPlay);
		} else {
			song.howl.play();
			return Promise.resolve(indexToPlay);
		}
		//set seekbar duration
	}

	public pause(index?: number) {
		if (this._playlist.length === 0) return;

		if (index) {
			const song = this._playlist[index];
			if (song.howl) {
				song.howl.pause();
			}
		} else {
			// we pause all item in the playlist (several can play together)
			this._playlist.forEach((song: Song, songIndex: number) => {
				if (song.howl) {
					song.howl.pause();
				}
			});
		}
		this.updatePositions();
	}

	public stop(index?: number) {
		if (this._playlist.length === 0) return;

		if (index) {
			const song = this._playlist[index];
			if (song.howl) {
				song.howl.stop();
			}
		} else {
			// we stop all item in the playlist (several can play together)
			this._playlist.forEach((song: Song, songIndex: number) => {
				if (song.howl) {
					song.howl.stop();
				}
			});
		}
	}

	public next() {
		if (this._playlist.length === 0) return;

		// remember value before stopping
		const isPlaying = this.isPlaying;

		this.stop();

		if (this.index + 1 >= this._playlist.length) {
			this.index = 0;
		} else {
			this.index += 1;
		}

		// dispatch next event
		const event = new CustomEvent('next', {
			detail: { index: this.index, playingState: this.isPlaying },
		});
		this.dispatchEvent(event);

		// re-use value from before stop
		if (isPlaying) {
			this.play();
		}
	}

	public prev() {
		console.log('PREV BUTTON CALLED');
		if (this._playlist.length === 0) return;

		const song = this._playlist[this.index];
		const currentPosition = song.howl.seek() as number;
		if (currentPosition > 2) {
			this.seek(0);
			return;
		}

		// remember value before stopping
		const isPlaying = this.isPlaying;

		this.stop();
		if (this.index - 1 < 0) {
			this.index = this._playlist.length - 1;
		} else {
			this.index -= 1;
		}

		// dispach previous event
		const event = new CustomEvent('previous', {
			detail: { index: this.index, playingState: this.isPlaying },
		});
		this.dispatchEvent(event);

		if (isPlaying) {
			this.play();
		}
	}

	public seekPerPercentage(percentage: number, index?: number) {
		// Seek to a given percentage of actual song
		// get current song
		const song = this.playlist[this._index];
		//check if song is initialised
		if (!song.howl) {
			song.howl = this.createHowlWithBindings(song);
			if (song.howl.state() === 'loading') {
				song.howl.once('load', () => {
					song.howl.seek((percentage * song.howl.duration()) / 100);
				});
			} else if (song.howl.state() === 'loaded') {
				song.howl.seek((percentage * song.howl.duration()) / 100);
			}
		} else {
			song.howl.seek((percentage * song.howl.duration()) / 100);
		}
		// console.log('song status ', song.howl.state())
		//get song duration
		// convert percentage to position
		// seek
		//play if playing
	}
	// Move player head to a given time position (s)
	public seek(position: number, index?: number) {
		if (this._playlist.length === 0) return;
		const indexToSeek = index || this.index;
		const song = this._playlist[indexToSeek];
		console.log('position is ', position);
		if (!song.howl) {
			song.howl = this.createHowlWithBindings(song);
		}
		song.howl.seek(position);
		//
		// if (song.howl.state() === 'unloaded') {
		// 	song.howl.once('load', () => {
		// 		song.howl.seek(position);
		// 		console.log('loaded ', song.howl.seek(), song.howl.duration());
		// 	});
		// 	song.howl.load();
		// } else if (song.howl.state() === 'loading') {
		// 	song.howl.once('load', () => {
		// 		song.howl.seek(position);
		// 		console.log('loaded ', song.howl.seek(), song.howl.duration());
		// 	});
		// } else {
		// 	song.howl.seek(position);
		// }
	}

	public setPlaylistFromUrls(urls: string[]) {
		this.playlist = urls.map((url, index) => {
			return {
				title: 'Song ' + index,
				file: url,
				howl: null,
				id: uuidv4(),
			} as Song;
		});
	}

	async download(index?: number) {
		const indexToDowload = index || this.index;
		const song = this.playlist[indexToDowload];
		downloadFile(
			await urlToFile(song.file, song.title, 'application/octet-stream')
		);
	}

	/** FOR HTML SUPPORT */
	playButton: HTMLButtonElement;
	pauseButton: HTMLButtonElement;
	stopButton: HTMLButtonElement;
	downloadButton: HTMLButtonElement;
	nextButton: HTMLButtonElement;
	prevButton: HTMLButtonElement;

	connectedCallback() {
		this.addChildren();
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
		this._seekbar = new LinearSeekBar(10, 'gray', 0);
		this._seekbar.addEventListener('seek', (event: CustomEvent) => {
			console.log('seeking player head to ', event.detail.percentage);
			this.seekPerPercentage(event.detail.percentage);
		});
	}

	addChildren() {
	  if(!this.customButtons){
      this.appendChild(this.playButton);
      this.appendChild(this.pauseButton);
      this.appendChild(this.stopButton);
      this.appendChild(this.downloadButton);
      this.appendChild(this.nextButton);
      this.appendChild(this.prevButton);
    }
		else{
		  const customKeyValue  = {
		    '[play]':this.playButton,
        '[pause]': this.pauseButton,
        '[stop]' : this.stopButton,
        '[next]' : this.nextButton,
        '[prev]' : this.prevButton,
        '[download]' : this.downloadButton
      } as {[key: string] : HTMLButtonElement}
      this.customButtons.forEach(value => {
        this.appendChild(customKeyValue[value])
      })
    }
		this.appendChild(document.createElement('br'));
		this.appendChild(this._seekbar);
	}

	bindHTMLElements() {
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
	}
}

customElements.define('rs-player', RumblePlayer);
