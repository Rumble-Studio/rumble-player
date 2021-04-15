import { Howl } from 'howler';
import { v4 as uuidv4 } from 'uuid';

export const UPDATE_DELAY = 100;

export interface Song {
	id: string; // unique id to identify the song even when we add new song to the playlist
	title: string;
	file: string;
	howl: Howl | null;
	position?: number | null; // current seeking of position of the howl
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

export class RumblePlayerService {
	autoPlayNext = true; // do we play automatically next song

	isPlaying = false;

	playingOn() {
		this.isPlaying = true;
		this.dispatchPlayerEvent(playerServiceEventType.play);
	}
	playingOff() {
		this.isPlaying = false;
		this.dispatchPlayerEvent(playerServiceEventType.pause);
	}

	// index in playlist
	private _index: number;
	get index() {
		return this._index;
	}
	set index(value: number) {
		if (value != this._index) {
			this._index = value;
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
	}

	// current duration
	private _duration: number;
	get duration() {
		return this._duration;
	}
	// current position
	percentage: number;
	private _position: number;
	get position() {
		return this._position;
	}
	set position(value: number) {
		this._position = value;
	}
	constructor() {
		this._playlist = [];
		this._index = -1;
		this._position = 0;
		this.percentage = 0;

		setInterval(() => {
			this.updatePositions();
		}, UPDATE_DELAY);
	}

	getRank(song: Song) {
		return this._playlist.map((s) => s.id).indexOf(song.id);
	}

	updatePositions() {
		if (this._playlist.length === 0) return;
		let duration = 0;
		this._playlist.forEach((song: Song, songIndex: number) => {
			if (song.howl) {
				song.position = song.howl.seek() as number;
			} else {
				song.position = -1;
			}
		});
		if (this.playlist[this.index].howl) {
			duration = this.playlist[this.index].howl.duration();
		}
		this.position = this.playlist[this.index].position;
		this.percentage = duration > 0 ? this.position / duration : 0; // TODO compute percentage based on current file being played
		this.newPositionCallback(this.position);
		this.newPercentageCallback(this.percentage);
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
			},
			onloaderror: (error) => {
				console.log('error howler loading', error);
				this.playingOff();
			},
			onend: () => {
				console.log('%cend.', 'color:cyan');
				if (this.autoPlayNext) this.next();
				else {
					this.stop();
				}
			},
			onpause: () => {
				console.log('%cpause.', 'color:cyan');
				this.playingOff();
			},
			onplay: () => {
				console.log('%cplay.', 'color:cyan');
				this.playingOn();
			},
			onseek: () => {
				console.log('%cseek.', 'color:cyan');
			},
		});
		return howl;
	}

	// should return as a promise the current index asked to be played
	public play(index?: number): Promise<number> {
		console.log('Asked to play From Service 1:', index);

		if (index > -1 && index < this.playlist.length) {
			console.log('given index is', index);
			this.index = index;
		}

		// if no playlist index is -1
		if (this._playlist.length === 0) return Promise.resolve(-1);

		const indexToPlay = this.index;
		console.log('Asked to play  From Service 2:', indexToPlay);

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
	}

	public pause(index?: number) {
		if (this._playlist.length === 0) return;
		console.log('Asked to pause', index);
		if (index > -1 && index < this.playlist.length) {
			console.log('Asked to pause:given index is', index);
			const song = this._playlist[index];
			if (song.howl) {
				console.log('Asked to pause:given index is', index);
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
				this.dispatchPlayerEvent(playerServiceEventType.stop);
			}
		} else {
			// we stop all item in the playlist (several can play together)
			this._playlist.forEach((song: Song, songIndex: number) => {
				if (song.howl) {
					song.howl.stop();
					this.dispatchPlayerEvent(playerServiceEventType.stop);
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

		// re-use value from before stop
		if (isPlaying) {
			this.play();
		}
		this.dispatchPlayerEvent(playerServiceEventType.next);
	}

	public prev() {
		console.log('PREV BUTTON CALLED');
		if (this._playlist.length === 0) return;

		const song = this._playlist[this.index];
		if (song.howl) {
			const currentPosition = song.howl.seek() as number;
			if (currentPosition < 2) {
				this.seekPerPosition(0);
				this.dispatchPlayerEvent(playerServiceEventType.prev);
				return;
			}
		}

		// remember value before stopping
		const isPlaying = this.isPlaying;

		this.stop();
		if (this.index - 1 < 0) {
			this.index = this._playlist.length - 1;
		} else {
			this.index -= 1;
		}

		if (isPlaying) {
			this.play();
		}
		this.dispatchPlayerEvent(playerServiceEventType.prev);
	}

	public seekPerPercentage(percentage: number, index?: number) {
		// Seek to a given percentage of actual song
		// get current song
		const isPlaying = this.isPlaying;
		this.pause();
		let song = null;
		if (index !== undefined && index !== null) {
			song = this.playlist[index];
			console.log('SEEK INDEX', index, song);
			this.index = index;
		} else {
			song = this.playlist[this._index];
		}

		//check if song is initialised
		if (!song.howl) {
			song.howl = this.createHowlWithBindings(song);
			if (song.howl.state() === 'loading') {
				song.howl.once('load', () => {
					song.howl.seek(percentage * song.howl.duration());
				});
			} else if (song.howl.state() === 'loaded') {
				song.howl.seek(percentage * song.howl.duration());
			}
		} else {
			song.howl.seek(percentage * song.howl.duration());
		}
		this.dispatchPlayerEvent(playerServiceEventType.seek);
		// console.log('song status ', song.howl.state())
		//get song duration
		// convert percentage to position
		// seek
		//play if playing
		if (isPlaying) {
			this.play();
		}
	}
	// Move player head to a given time position (s)
	public seekPerPosition(position: number, index?: number) {
		if (this._playlist.length === 0) return;
		const indexToSeek = index || this.index;
		const song = this._playlist[indexToSeek];
		console.log('position is ', position);
		if (!song.howl) {
			song.howl = this.createHowlWithBindings(song);
		}
		if (position > song.howl.duration()) {
			this.next();
		} else if (position < 0) {
			song.howl.seek(0);
		} else {
			song.howl.seek(position);
		}
	}

	public setPlaylistFromUrls(urls: string[]) {
		console.log('RSS set playlist', urls);
		this.playlist = urls.map((url, index) => {
			return {
				title: 'Song ' + index,
				file: url,
				howl: null,
				id: uuidv4(),
			} as Song;
		});
	}
	public setPLaylistFromRSSFeedURL(url: string) {
		return fetch(url)
			.then((r) => r.text())
			.then((r) => {
				const parser = new DOMParser();
				const dom = parser.parseFromString(r, 'application/xml');
				const songList = [];
				dom.documentElement
					.querySelectorAll('item')
					.forEach((value, key) => {
						songList.push(value.querySelector('link').textContent);
					});
				console.log('RSS Decoded', songList);
				this.setPlaylistFromUrls(songList);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	async download(index?: number) {
		const indexToDowload = index || this.index;
		const song = this.playlist[indexToDowload];
		downloadFile(
			await urlToFile(song.file, song.title, 'application/octet-stream')
		);
	}

	/* CALLBACKS ON UPDATE */
	public positionUpdateCallbacks: ((position: number) => void)[] = [];
	public newPositionCallback(position: number) {
		this.positionUpdateCallbacks.forEach((c) => {
			c(position);
		});
	}
	public percentageUpdateCallbacks: ((percentage: number) => void)[] = [];
	public newPercentageCallback(percentage: number) {
		this.percentageUpdateCallbacks.forEach((c) => {
			c(percentage);
		});
	}

	/* CALLBACKS ON STATE CHANGE */
	public playingEventsCallbacks: ((event: playerServiceEvent) => void)[] = [];
	public playerStateChangedCallback(event: playerServiceEvent) {
		this.playingEventsCallbacks.forEach((callback) => {
			callback(event);
		});
	}

	private dispatchPlayerEvent(type: playerServiceEventType) {
		const event: playerServiceEvent = {
			type,
			state: {
				position: this.position,
				percentage: this.percentage,
				index: this.index,
				playing: this.isPlaying,
			} as playerState,
		};
		this.playerStateChangedCallback(event);
	}
}
enum playerServiceEventType {
	'play' = 'play',
	'pause' = 'pause',
	'stop' = 'stop',
	'next' = 'next',
	'prev' = 'prev',
	'seek' = 'seek',
}
export interface playerState {
	position: number;
	percentage: number;
	index: number;
	playing: boolean;
}
export interface playerServiceEvent {
	type: playerServiceEventType;
	state: playerState;
}
