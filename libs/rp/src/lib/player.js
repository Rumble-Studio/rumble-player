var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
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
	constructor(title) {
		super();
		this.isPlaying = false;
		this._playlist = [];
		this._index = -1;
		this.createHTMLChildren();
		this.bindHTMLElements();
		if (title) {
			this.title = title;
		}
	}
	get index() {
		return this._index;
	}
	set index(value) {
		if (value != this._index) {
			console.log('index changed from ', this._index, ' ', value);
			this._index = value;
			const eventIndexChange = new CustomEvent('indexChange', {
				detail: value,
			});
			this.dispatchEvent(eventIndexChange);
			this._updateAudioPlayerSrc();
		}
	}
	connectedCallback() {
		this.addChildren();
	}
	getPlaylist() {
		return this._playlist;
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
	getSeekingTime() {
		return this.audio.currentTime;
	}
	getTotalDuration(){
	  if (this.audio.totalDuration){
      return this.audio.totalDuration
    }
	  return 0;
  }
	play() {
		if (this._playlist.length === 0) return;
		return this.audio
			.play()
			.then(() => {
				this.isPlaying = true;
				console.log('playing started', this.index, this.audio.currentTime);
				const event = new CustomEvent('play', {
					detail: { index: this.index, position: this.audio.currentTime },
				});
				this.dispatchEvent(event);
			})
			.catch((err) => {
				console.error('Error when asked to play', err);
				this.isPlaying = false;
			});
	}
	pause() {
		if (this._playlist.length === 0) return;
		this.audio.pause();
		this.isPlaying = false;
		console.log('playing paused');
		const event = new CustomEvent('pause', {
			detail: { index: this.index, position: this.audio.currentTime },
		});
		this.dispatchEvent(event);
	}
	stop() {
		if (this._playlist.length === 0) return;
		if (this.isPlaying) {
			this.pause();
		}
		this.seek(0);
	}
	next() {
		if (this._playlist.length === 0) return;
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
	prev() {
		if (this._playlist.length === 0) return;
		if (this.audio.currentTime >= 2) {
			this.seek(0);
			return;
		}
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
	seek(position) {
		if (this._playlist.length === 0) return;
		// Move player head to a given time position(in seconds)
		this.audio.currentTime = position;
		const event = new CustomEvent('seek', {
			detail: { index: this.index, playingState: this.isPlaying, position },
		});
		this.dispatchEvent(event);
	}
	setPlaylist(playlist) {
		// To accept several audio urls
		this.index = -1;
		this._playlist = playlist;
		this.index = this._playlist.length > 0 ? 0 : -1;
		this.stop();
	}
	_updateAudioPlayerSrc() {
		if (this.audio.getAttribute('src') === this._playlist[this.index]) return;
		this.audio.setAttribute('src', this._playlist[this.index]);
	}
	download() {
		return this.downloadUrl(
			this._playlist[this.index],
			'rs-player-file.mp3',
			'audio/*'
		);
	}
	downloadUrl(url, filename, mimeType) {
		return __awaiter(this, void 0, void 0, function* () {
			this.downloadFile(yield this.urlToFile(url, filename, mimeType));
		});
	}
	urlToFile(url, filename, mimeType) {
		return fetch(url)
			.then(function (res) {
				return res.arrayBuffer();
			})
			.then(function (buf) {
				return new File([buf], filename, { type: mimeType });
			});
	}
	downloadFile(file) {
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
RumblePlayer.observedAttributes = ['title'];
customElements.define('rs-player', RumblePlayer);
