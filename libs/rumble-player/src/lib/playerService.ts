import { Howl } from 'howler';
import { v4 as uuidv4 } from 'uuid';

export const UPDATE_DELAY = 500;

export interface Song {
	id: string; // unique id to identify the song even when we add new song to the playlist
	title: string;
	file: string;
	howl: Howl | null;
	duration: number | null;
	loaded: boolean;
	valid: boolean;
	image?: string | null;
	position?: number | null; // current seeking of position of the howl
	onload?: (song: Song) => void;
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
	// automatically play next song
	autoPlayNext = true;
	// get wether a song is being played or not
	private _isPlaying = false;
	// Automatically play on load
	autoPlay = false;
	// Loop the playing sound when it ends
	loop = false;
	// Wether or not to shuffle the playlist
	_shuffle = false;

	set shuffle(value: boolean) {
		console.log('SET Shuffle to ', value);
		this._shuffle = value;
		if (!value) {
			this._shuffledPlaylist = this._playlist;
		} else {
			this.shufflePlaylist();
		}
		this.emit(playerServiceEventType.newPlaylist);
	}
	get shuffle() {
		return this._shuffle;
	}

	// Wether or not to shuffle the playlist
	_unloadAll = false;
	get unloadAll() {
		return this._unloadAll;
	}
	set unloadAll(value: boolean) {
		if (value === this._unloadAll) return;
		this._unloadAll = value;
		if (value) {
			this.unload();
		} else {
			this.preloadPlaylist();
		}
	}

	// The rate of playback. 0.5 to 4.0, with 1.0 being normal speed.
	private _rate = 1;
	get rate(): number {
		return this._rate;
	}
	set rate(rate: number) {
		if (rate <= 4 && rate >= 0) {
			this._playlist.forEach((song) => {
				if (song.howl && song.valid) {
					song.howl.rate(rate);
				}
			});
			this._rate = rate;
		}
	}

	get isPlaying() {
		return this._isPlaying;
	}
	private _volume = 1;
	get volume() {
		return this._volume;
	}
	set volume(level: number) {
		if (level <= 1 && level >= 0) {
			if (this._isPlaying) {
				this._playlist[this.index].howl.volume(level);
			}
			this._playlist.forEach((value, index) => {
				if (index !== this.index && value.howl) {
					value.howl.volume(level);
				}
			});
		}
	}

	private playingOn() {
		this._isPlaying = true;
		this.emit(playerServiceEventType.play);
	}
	private playingOff() {
		this._isPlaying = false;
		this.emit(playerServiceEventType.pause);
	}

	// index in playlist
	private _index: number;
	get index() {
		return this._index;
	}
	set index(value: number) {
		if (value != this._index) {
			this._index = value;
			this.emit(playerServiceEventType.newIndex);
		}
	}

	// playlist
	private _playlist: Song[];
	private _shuffledPlaylist: Song[];
	get playlist() {
		if (this._shuffle === true) {
			return this._shuffledPlaylist;
		}
		return this._playlist;
	}
	set playlist(playlist: Song[]) {
		this.stop(); // stop before doing anything else
		this._playlist = playlist;
		this._shuffledPlaylist = playlist;
		this.index = this._playlist.length > 0 ? 0 : -1;
		this.preloadPlaylist();
		this.emit(playerServiceEventType.newPlaylist);
	}

	// current duration
	private _duration: number;
	get duration() {
		return this._duration;
	}
	// current position
	private _percentage: number;
	get percentage() {
		return this._percentage;
	}
	private _position: number;
	get position() {
		return this._position;
	}
	constructor() {
		this._playlist = [];
		this._index = -1;
		this._position = 0;
		this._percentage = 0;

		setInterval(() => {
			this.updatePositions();
		}, UPDATE_DELAY);
	}

	getRank(song: Song) {
		return this.playlist.map((s) => s.id).indexOf(song.id);
	}

	private updatePositions() {
		if (this.playlist.length === 0) return;
		let duration = 0;
		this.playlist.forEach((song: Song, songIndex: number) => {
			if (song.howl && song.valid && song.loaded) {
				song.position = song.howl.seek() as number;
			} else {
				song.position = -1;
			}
		});
		if (this.playlist[this.index].howl) {
			duration = this.playlist[this.index].howl.duration();
		}
		this._position = this.playlist[this.index].position;
		this._percentage = duration > 0 ? this.position / duration : 0; // TODO compute percentage based on current file being played
		this.newPositionCallback(this.position);
		this.newPercentageCallback(this.percentage);
	}

	getSong(index: number, instanciateHowlIfMissing = true) {
		const song = this.playlist[index];
		if (!song.valid) {
			// song invalid is return as it is without loading any more howl
			return song;
		}

		if (!song.howl && instanciateHowlIfMissing) {
			song.howl = this.createHowlWithBindings(song, index);
			if (!song.howl) {
				song.valid = false;
			}
		}
		return song;
	}

	private createHowlWithBindings(song: Song, index = -1): Howl | null {
		// Extract the file extension from the URL or base64 data URI.
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const str = song.file;
		let ext: RegExpExecArray = /^data:audio\/([^;,]+);/i.exec(str);
		if (!ext) {
			ext = /\.([^.]+)$/.exec(str.split('?', 1)[0]);
		}
		const extLowerCase: string = ext ? ext[1].toString().toLowerCase() : '';
		if (!extLowerCase) {
			// howler library can't manage file without extension
			console.warn(
				'This file does not have an extension and will be ignored by the player'
			);
			if (index > -1) {
				this.playlist[index].valid = false;
				this.playlist[index].loaded = false;
			}
			return null;
		}
		const howl = new Howl({
			src: [song.file],
			html5: true,
			onplayerror: (error) => {
				console.error('error howler playing', error);
				this.emit(playerServiceEventType.playerror);
				this.playingOff();
				if (index > -1) {
					this.playlist[index].valid = false;
					this.playlist[index].loaded = false;
				}
			},
			onload: () => {
				if (index > -1) {
					console.log('load', song.title);
					this.playlist[index].valid = true;
					this.playlist[index].loaded = true;
				}
				if (index === 0 && this.autoPlay) this.play(0);
				song.onload(song);
			},
			onloaderror: (error) => {
				console.warn('error howler loading', error);
				this.emit(playerServiceEventType.loaderror);
				this.playingOff();
				if (index > -1) {
					this.playlist[index].valid = true;
					this.playlist[index].loaded = true;
				}
			},
			onend: () => {
				if (this.loop) {
					this.seekPerPercentage(0);
					this.emit(playerServiceEventType.end);
					this.play();
					console.log('OCCURED will loop');
					return;
				}
				if (this.autoPlayNext) this.next();
				else {
					this.stop();
				}
				this.emit(playerServiceEventType.end);
			},
			onpause: () => {
				this.playingOff();
			},
			onplay: () => {
				this.playingOn();
			},
			onseek: () => {
				//
			},
		});
		return howl;
	}

	preloadPlaylist() {
		if (this.unloadAll) {
			this.unload();
			return;
		}
		this.playlist.forEach((song, index) => {
			song.howl = this.createHowlWithBindings(song, index);
		});
	}
	unloadSong(song: Song) {
		if (song.valid && song.howl) {
			song.howl.unload();
			song.loaded = false;
			console.log('unloaded', song.title);
		}
	}
	loadSong(song: Song) {
		if (song.valid && song.howl) {
			song.howl.load();
			song.loaded = true;
			console.log('loaded', song.title);
		}
	}

	addSong(url: string) {
		const index = this.playlist.length;
		const song = this.generateSongFromUrl(url, index);
		console.log('ADD SONG', song, index);
		const newPlaylist = this.playlist;
		newPlaylist.push(song);
		console.log('ADD SONG', this.playlist, newPlaylist);

		this.playlist = newPlaylist;
		this.playlist[index].howl = this.createHowlWithBindings(song, index);
	}

	// should return as a promise the current index asked to be played
	public play(index?: number): Promise<number> {
		console.log('Asked to play From Service 1:', index);

		if (index > -1 && index < this.playlist.length) {
			console.log('given index is', index);
			this.index = index;
		}

		// if no playlist index is -1
		if (this.playlist.length === 0) return Promise.resolve(-1);

		const indexToPlay = this.index;
		console.log('Asked to play  From Service 2:', indexToPlay);

		// Check howl instance to play
		const song = this.getSong(indexToPlay);
		if (song.howl && !song.valid) {
			return;
		}

		// Check if howl is already playing
		if (song.valid) {
			if (song.howl.playing()) {
				return Promise.resolve(indexToPlay);
			} else {
				song.howl.play();
				return Promise.resolve(indexToPlay);
			}
		}
	}

	public pause(options?: { index?: number; pauseOthers?: boolean }) {
		if (this.playlist.length === 0) return;

		if (
			options &&
			options.index > -1 &&
			options.index < this.playlist.length &&
			!options.pauseOthers
		) {
			// should pause only 1 song
			const song = this.playlist[options.index];
			if (song.howl && song.valid) {
				song.howl.pause();
			}
		}
		if (
			options &&
			options.index > -1 &&
			options.index < this.playlist.length &&
			options.pauseOthers
		) {
			// should pause OTHERS only
			this.playlist.forEach((song: Song, songIndex: number) => {
				if (song.howl && song.valid && songIndex != options.index) {
					song.howl.pause();
				}
			});
		} else {
			// we pause all song in the playlist (several can play together)
			this.playlist.forEach((song: Song, songIndex: number) => {
				if (song.howl && song.valid) {
					song.howl.pause();
				}
			});
		}
		this.updatePositions();
	}

	public stop(index?: number) {
		if (this.playlist.length === 0) return;

		if (index) {
			const song = this.playlist[index];
			if (song.howl && song.valid) {
				song.howl.stop();
				this.emit(playerServiceEventType.stop);
			}
		} else {
			// we stop all songs in the playlist (several can play together)
			this.playlist.forEach((song: Song, songIndex: number) => {
				if (song.howl && song.valid) {
					song.howl.stop();
					this.emit(playerServiceEventType.stop);
				}
			});
		}
	}

	public next() {
		if (this.playlist.length === 0) {
			console.warn("Can't do next: no file available.");
			return;
		}

		// remember value before stopping
		const isPlaying = this._isPlaying;
		this.stop();

		// if no other song is valid we stop
		if (!this.playlist.some((s) => s.valid)) {
			console.warn("Can't do next: no file valid.");
			return;
		}

		if (this.index + 1 >= this.playlist.length) {
			this.index = 0;
		} else {
			this.index += 1;
		}

		// re-use value from before stop
		if (!this.playlist[this.index].valid) {
			this.next();
			return;
		}
		if (isPlaying) {
			this.play();
		}
		const length = this.playlist.length;
		if (this.unloadAll && length >= 5) {
			let indexToLoad: number;
			let indexToUnLoad: number;
			if (this.index === 0) {
				indexToUnLoad = length - 2;
				indexToLoad = 1;
			} else if (this.index === 1) {
				indexToUnLoad = length - 1;
				indexToLoad = this.index + 1;
			} else {
				indexToLoad = this.index === length - 1 ? 0 : this.index + 1;
				indexToUnLoad = this.index - 2;
			}
			console.log(indexToLoad, indexToUnLoad);
			this.loadSong(this.playlist[indexToLoad]);
			this.unloadSong(this.playlist[indexToUnLoad]);
		}
		this.emit(playerServiceEventType.next);
	}

	public prev() {
		console.log('PREV BUTTON CALLED');
		if (this.playlist.length === 0) return;

		const song = this.getSong(this.index);
		if (song.howl && song.valid) {
			const currentPosition = song.howl.seek() as number;
			if (currentPosition > 2) {
				console.log('Will restart play');
				this.seekPerPosition(0);
				this.emit(playerServiceEventType.play);
				return;
			}
		}

		// remember value before stopping
		const isPlaying = this._isPlaying;

		this.stop();

		// if no other song is valid we stop
		if (!this.playlist.some((s) => s.valid)) {
			console.warn("Can't do prev: no file valid.");
			return;
		}

		if (this.index - 1 < 0) {
			this.index = this.playlist.length - 1;
		} else {
			this.index -= 1;
		}
		if (!this.playlist[this.index].valid) {
			this.prev();
			return;
		}

		if (isPlaying) {
			this.play();
		}
		const length = this.playlist.length;
		if (this.unloadAll && length >= 5) {
			let indexToLoad: number;
			let indexToUnLoad: number;
			if (this.index === 0) {
				indexToLoad = length - 1;
				indexToUnLoad = 2;
			} else if (this.index === length - 1) {
				indexToUnLoad = 1;
				indexToLoad = length - 2;
			} else {
				indexToLoad = this.index - 1;
				indexToUnLoad = this.index === length - 2 ? 0 : this.index + 2;
			}
			this.loadSong(this.playlist[indexToLoad]);
			this.unloadSong(this.playlist[indexToUnLoad]);
		}
		this.emit(playerServiceEventType.prev);
	}

	public seekPerPercentage(percentage: number, index?: number) {
		console.log('SEEK PER PERCENTAGE', percentage, index);
		if (this.playlist.length === 0) return;

		let indexToSeek = this.index;
		if (index !== undefined && index > -1 && index < this.playlist.length) {
			indexToSeek = index;
		}
		console.log('Final index to seek per percentage:', indexToSeek);
		const song = this.getSong(indexToSeek);
		if (song.howl.state() === 'loading') {
			song.howl.once('load', () => {
				const position = percentage * song.howl.duration();
				this.seekPerPosition(position, indexToSeek);
			});
		} else if (song.howl.state() === 'loaded') {
			const position = percentage * song.howl.duration();
			this.seekPerPosition(position, indexToSeek);
		}
	}

	// Move player head to a given time position (s)
	public seekPerPosition(position: number, index?: number) {
		console.log('SEEK PER POSITION', position, index);

		if (this.playlist.length === 0) return;

		let indexToSeek = this.index;
		if (index !== undefined && index > -1 && index < this.playlist.length) {
			indexToSeek = index;
		}
		const song = this.getSong(indexToSeek);
		console.log('SEEK PER POSITION, index being used:', { indexToSeek });

		if (song.howl.state() === 'loading') {
			song.howl.once('load', () => {
				if (position > song.howl.duration()) {
					this.next();
				} else if (position < 0) {
					song.howl.seek(0);
				} else {
					song.howl.seek(position);
				}
			});
		} else if (song.howl.state() === 'loaded') {
			if (position > song.howl.duration()) {
				this.next();
			} else if (position < 0) {
				song.howl.seek(0);
			} else {
				song.howl.seek(position);
			}
		}
	}

	public getSongTimeLeft(index?: number) {
		if (this.playlist.length === 0) return -1;

		let indexToSeek = this.index;
		if (index !== undefined && index > -1 && index < this.playlist.length) {
			indexToSeek = index;
		}
		const song = this.getSong(indexToSeek);
		if (!song.valid) {
			return -1;
		}
		if (song.howl.state() === 'loading') {
			// TODO: can we improve behaviour with a Promise?f
			return -1;
		} else if (song.howl.state() === 'loaded') {
			return song.howl.duration() - <number>song.howl.seek();
		}
	}

	public getSongTotalTime(index?: number) {
		if (this.playlist.length === 0) return -1;

		let indexToSeek = this.index;
		if (index !== undefined && index > -1 && index < this.playlist.length) {
			indexToSeek = index;
		}
		const song = this.getSong(indexToSeek);
		if (!song.valid) {
			return -1;
		}
		if (song.howl.state() === 'loading') {
			// TODO: can we improve behaviour with a Promise?
			return -1;
		} else if (song.howl.state() === 'loaded') {
			return song.howl.duration();
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
	public setPlaylistFromObject(data: any[]) {
		this.playlist = data.map((object, index) => {
			return {
				title: object.title,
				file: object.file,
				howl: null,
				id: uuidv4(),
				image: object.image,
			} as Song;
		});
	}
	private generateSongFromUrl(url: string, index: number) {
		return {
			title: 'Song ' + index,
			file: url,
			howl: null,
			id: uuidv4(),
		} as Song;
	}

	public setPLaylistFromRSSFeedURL(url: string) {
		return fetch(url)
			.then((r) => r.text())
			.then((r) => {
				const parser = new DOMParser();
				const dom = parser.parseFromString(r, 'application/xml');
				const songList = [] as any[];
				dom.documentElement
					.querySelectorAll('item')
					.forEach((value, key) => {
						const title = value.querySelector('title').textContent;
						const file = value
							.querySelector('enclosure')
							.getAttribute('url');
						const image = value
							.getElementsByTagName('itunes:image')
							.item(0)
							.getAttribute('href');

						const song = { title, file, image };
						songList.push(song);
					});
				this.setPlaylistFromObject(songList);
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

	private shufflePlaylist() {
		let currentIndex = this._shuffledPlaylist.length,
			temporaryValue,
			randomIndex;
		const array = this._shuffledPlaylist;
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		this._shuffledPlaylist = array;
		console.log('shuffling', this._shuffledPlaylist.slice(0, 10));
		// return newArray;
	}

	/* CALLBACKS ON UPDATE */
	public positionUpdateCallbacks: ((position: number) => void)[] = [];
	private newPositionCallback(position: number) {
		this.positionUpdateCallbacks.forEach((c) => {
			c(position);
		});
	}
	public percentageUpdateCallbacks: ((percentage: number) => void)[] = [];
	private newPercentageCallback(percentage: number) {
		this.percentageUpdateCallbacks.forEach((c) => {
			c(percentage);
		});
	}

	/* CALLBACKS ON STATE CHANGE */
	public playingEventsCallbacks: ((event: playerServiceEvent) => void)[] = [];
	private playerStateChangedCallback(event: playerServiceEvent) {
		this.playingEventsCallbacks.forEach((callback) => {
			callback(event);
		});
	}

	private eventDispatchCallback(event: playerServiceEvent) {
		switch (event.type) {
			case playerServiceEventType.play:
				this._onPlayListener.forEach((callback) => {
					callback(event);
				});
				this._oncePlayListener.forEach((callback) => {
					callback(event);
				});
				this._oncePlayListener = [];
				break;
			case playerServiceEventType.pause:
				this._onPauseListener.forEach((callback) => {
					callback(event);
				});
				this._oncePauseListener.forEach((callback) => {
					callback(event);
				});
				this._oncePauseListener = [];
				break;
			case playerServiceEventType.stop:
				this._onStopListener.forEach((callback) => {
					callback(event);
				});
				this._onceStopListener.forEach((callback) => {
					callback(event);
				});
				this._onceStopListener = [];
				break;
			case playerServiceEventType.next:
				this._onNextListener.forEach((callback) => {
					callback(event);
				});
				this._onceNextListener.forEach((callback) => {
					callback(event);
				});
				this._onceNextListener = [];
				break;
			case playerServiceEventType.prev:
				this._onPrevListener.forEach((callback) => {
					callback(event);
				});
				this._oncePrevListener.forEach((callback) => {
					callback(event);
				});
				this._oncePrevListener = [];
				break;
			case playerServiceEventType.seek:
				this._onSeekListener.forEach((callback) => {
					callback(event);
				});
				this._onceSeekListener.forEach((callback) => {
					callback(event);
				});
				this._onceSeekListener = [];
				break;
			case playerServiceEventType.end:
				this._onEndListener.forEach((callback) => {
					callback(event);
				});
				this._onceEndListener.forEach((callback) => {
					callback(event);
				});
				this._onceEndListener = [];
				break;
			case playerServiceEventType.playerror:
				this._onPlayerrorListener.forEach((callback) => {
					callback(event);
				});
				this._oncePlayerrorListener.forEach((callback) => {
					callback(event);
				});
				this._oncePlayerrorListener = [];
				break;
			case playerServiceEventType.loaderror:
				this._onLoaderrorListener.forEach((callback) => {
					callback(event);
				});
				this._onceLoaderrorListener.forEach((callback) => {
					callback(event);
				});
				this._onceLoaderrorListener = [];
				break;
			case playerServiceEventType.newPlaylist:
				this._onNewPlaylistListener.forEach((callback) => {
					callback(event);
				});
				this._onceNewPlaylistListener.forEach((callback) => {
					callback(event);
				});
				this._onceNewPlaylistListener = [];
				break;
			case playerServiceEventType.newIndex:
				this._onNewIndexListener.forEach((callback) => {
					callback(event);
				});
				this._onceNewIndexListener.forEach((callback) => {
					callback(event);
				});
				this._onceNewIndexListener = [];
				break;
		}
	}

	// Listeners
	private _onPlayListener: ((event: playerServiceEvent) => void)[] = [];
	private _oncePlayListener: ((event: playerServiceEvent) => void)[] = [];

	private _onPauseListener: ((event: playerServiceEvent) => void)[] = [];
	private _oncePauseListener: ((event: playerServiceEvent) => void)[] = [];

	private _onStopListener: ((event: playerServiceEvent) => void)[] = [];
	private _onceStopListener: ((event: playerServiceEvent) => void)[] = [];

	private _onNextListener: ((event: playerServiceEvent) => void)[] = [];
	private _onceNextListener: ((event: playerServiceEvent) => void)[] = [];

	private _onPrevListener: ((event: playerServiceEvent) => void)[] = [];
	private _oncePrevListener: ((event: playerServiceEvent) => void)[] = [];

	private _onEndListener: ((event: playerServiceEvent) => void)[] = [];
	private _onceEndListener: ((event: playerServiceEvent) => void)[] = [];

	private _onSeekListener: ((event: playerServiceEvent) => void)[] = [];
	private _onceSeekListener: ((event: playerServiceEvent) => void)[] = [];

	private _onPlayerrorListener: ((event: playerServiceEvent) => void)[] = [];
	private _oncePlayerrorListener: ((event: playerServiceEvent) => void)[] = [];

	private _onLoaderrorListener: ((event: playerServiceEvent) => void)[] = [];
	private _onceLoaderrorListener: ((event: playerServiceEvent) => void)[] = [];

	private _onNewPlaylistListener: ((event: playerServiceEvent) => void)[] = [];
	private _onceNewPlaylistListener: ((
		event: playerServiceEvent
	) => void)[] = [];

	private _onNewIndexListener: ((event: playerServiceEvent) => void)[] = [];
	private _onceNewIndexListener: ((event: playerServiceEvent) => void)[] = [];

	//
	public onEvent(name: string, callback: (event: playerServiceEvent) => void) {
		// Call the callback each time name event occurs

		switch (name) {
			case playerServiceEventType.play:
				if (!this._onPlayListener.find((value) => value === callback)) {
					this._onPlayListener.push(callback);
				}
				break;
			case playerServiceEventType.pause:
				if (!this._onPauseListener.find((value) => value === callback)) {
					this._onPauseListener.push(callback);
				}
				break;
			case playerServiceEventType.stop:
				if (!this._onStopListener.find((value) => value === callback)) {
					this._onStopListener.push(callback);
				}
				break;
			case playerServiceEventType.next:
				if (!this._onNextListener.find((value) => value === callback)) {
					this._onNextListener.push(callback);
				}
				break;
			case playerServiceEventType.prev:
				if (!this._onPrevListener.find((value) => value === callback)) {
					this._onPrevListener.push(callback);
				}
				break;
			case playerServiceEventType.seek:
				if (!this._onSeekListener.find((value) => value === callback)) {
					this._onSeekListener.push(callback);
				}
				break;
			case playerServiceEventType.end:
				if (!this._onEndListener.find((value) => value === callback)) {
					this._onEndListener.push(callback);
				}
				break;
			case playerServiceEventType.playerror:
				if (
					!this._onPlayerrorListener.find((value) => value === callback)
				) {
					this._onPlayerrorListener.push(callback);
				}
				break;
			case playerServiceEventType.loaderror:
				if (
					!this._onLoaderrorListener.find((value) => value === callback)
				) {
					this._onLoaderrorListener.push(callback);
				}
				break;
			case playerServiceEventType.newPlaylist:
				if (
					!this._onNewPlaylistListener.find((value) => value === callback)
				) {
					this._onNewPlaylistListener.push(callback);
				}
				break;
			case playerServiceEventType.newIndex:
				if (!this._onNewIndexListener.find((value) => value === callback)) {
					this._onNewIndexListener.push(callback);
				}
				break;
		}
	}

	public onceEvent(
		name: string,
		callback: (event: playerServiceEvent) => void
	) {
		// Call the callback the first time name event occurs
		switch (name) {
			case playerServiceEventType.play:
				if (!this._oncePlayListener.find((value) => value === callback)) {
					this._oncePlayListener.push(callback);
				}
				break;
			case playerServiceEventType.pause:
				if (!this._oncePauseListener.find((value) => value === callback)) {
					this._oncePauseListener.push(callback);
				}
				break;
			case playerServiceEventType.stop:
				if (!this._onceStopListener.find((value) => value === callback)) {
					this._onceStopListener.push(callback);
				}
				break;
			case playerServiceEventType.next:
				if (!this._onceNextListener.find((value) => value === callback)) {
					this._onceNextListener.push(callback);
				}
				break;
			case playerServiceEventType.prev:
				if (!this._oncePrevListener.find((value) => value === callback)) {
					this._oncePrevListener.push(callback);
				}
				break;
			case playerServiceEventType.seek:
				if (!this._onceSeekListener.find((value) => value === callback)) {
					this._onceSeekListener.push(callback);
				}
				break;
			case playerServiceEventType.end:
				if (!this._onceEndListener.find((value) => value === callback)) {
					this._onceEndListener.push(callback);
				}
				break;
			case playerServiceEventType.playerror:
				if (
					!this._oncePlayerrorListener.find((value) => value === callback)
				) {
					this._oncePlayerrorListener.push(callback);
				}
				break;
			case playerServiceEventType.loaderror:
				if (
					!this._onceLoaderrorListener.find((value) => value === callback)
				) {
					this._onceLoaderrorListener.push(callback);
				}
				break;
			case playerServiceEventType.newPlaylist:
				if (
					!this._onceNewPlaylistListener.find(
						(value) => value === callback
					)
				) {
					this._onceNewPlaylistListener.push(callback);
				}
				break;
			case playerServiceEventType.newIndex:
				if (
					!this._onceNewIndexListener.find((value) => value === callback)
				) {
					this._onceNewIndexListener.push(callback);
				}
				break;
		}
	}

	public removeEvent(
		name: string,
		callback: (event: playerServiceEvent) => void
	) {
		/* Remove the callback from the event name listeners
		 */
		switch (name) {
			case playerServiceEventType.play:
				this._onPlayListener = this._onPlayListener.filter(
					(value) => callback !== value
				);
				this._oncePlayListener = this._oncePlayListener.filter(
					(value) => callback !== value
				);
				break;
			case playerServiceEventType.pause:
				this._onPauseListener = this._onPauseListener.filter(
					(value) => callback !== value
				);
				this._oncePauseListener = this._oncePauseListener.filter(
					(value) => callback !== value
				);
				break;
			case playerServiceEventType.stop:
				this._onStopListener = this._onPauseListener.filter(
					(value) => callback !== value
				);
				this._onceStopListener = this._oncePauseListener.filter(
					(value) => callback !== value
				);
				break;
			case playerServiceEventType.next:
				this._onNextListener = this._onNextListener.filter(
					(value) => callback !== value
				);
				this._onceNextListener = this._onceNextListener.filter(
					(value) => callback !== value
				);
				break;
			case playerServiceEventType.prev:
				this._onPrevListener = this._onPrevListener.filter(
					(value) => callback !== value
				);
				this._oncePrevListener = this._oncePrevListener.filter(
					(value) => callback !== value
				);
				break;
			case playerServiceEventType.seek:
				this._onSeekListener = this._onSeekListener.filter(
					(value) => callback !== value
				);
				this._onceSeekListener = this._onceSeekListener.filter(
					(value) => callback !== value
				);
				break;
			case playerServiceEventType.end:
				this._onEndListener = this._onEndListener.filter(
					(value) => callback !== value
				);
				this._onceEndListener = this._onceEndListener.filter(
					(value) => callback !== value
				);
				break;
			case playerServiceEventType.playerror:
				this._onPlayerrorListener = this._onPlayerrorListener.filter(
					(value) => callback !== value
				);
				this._oncePlayerrorListener = this._oncePlayerrorListener.filter(
					(value) => callback !== value
				);
				break;
			case playerServiceEventType.loaderror:
				this._onLoaderrorListener = this._onLoaderrorListener.filter(
					(value) => callback !== value
				);
				this._onceLoaderrorListener = this._onceLoaderrorListener.filter(
					(value) => callback !== value
				);
				break;
			case playerServiceEventType.newPlaylist:
				this._onNewPlaylistListener = this._onNewPlaylistListener.filter(
					(value) => callback !== value
				);
				this._onceNewPlaylistListener = this._onceNewPlaylistListener.filter(
					(value) => callback !== value
				);
				break;
			case playerServiceEventType.newIndex:
				this._onNewIndexListener = this._onNewIndexListener.filter(
					(value) => callback !== value
				);
				this._onceNewIndexListener = this._onceNewIndexListener.filter(
					(value) => callback !== value
				);
				break;
		}
	}

	public flushListeners(name?: string) {
		/* If name specified, it will flush all the listeners on the event type
	  otherwise it will flush all events listeners
	  */
		if (name) {
			switch (name) {
				case playerServiceEventType.play:
					this._onPlayListener = [];
					this._oncePlayListener = [];
					break;
				case playerServiceEventType.pause:
					this._onPauseListener = [];
					this._oncePauseListener = [];
					break;
				case playerServiceEventType.stop:
					this._onStopListener = [];
					this._onceStopListener = [];
					break;
				case playerServiceEventType.next:
					this._onNextListener = [];
					this._onceNextListener = [];
					break;
				case playerServiceEventType.prev:
					this._onPrevListener = [];
					this._oncePrevListener = [];
					break;
				case playerServiceEventType.seek:
					this._onSeekListener = [];
					this._onceSeekListener = [];
					break;
				case playerServiceEventType.end:
					this._onEndListener = [];
					this._onceEndListener = [];
					break;
				case playerServiceEventType.playerror:
					this._onPlayerrorListener = [];
					this._oncePlayerrorListener = [];
					break;
				case playerServiceEventType.loaderror:
					this._onLoaderrorListener = [];
					this._onceLoaderrorListener = [];
					break;
				case playerServiceEventType.newPlaylist:
					this._onNewPlaylistListener = [];
					this._onceNewPlaylistListener = [];
					break;
				case playerServiceEventType.newIndex:
					this._onNewIndexListener = [];
					this._onceNewIndexListener = [];
					break;
			}
		} else {
			this._onPlayListener = [];
			this._oncePlayListener = [];

			this._onPauseListener = [];
			this._oncePauseListener = [];

			this._onStopListener = [];
			this._onceStopListener = [];

			this._onNextListener = [];
			this._onceNextListener = [];

			this._onPrevListener = [];
			this._oncePrevListener = [];

			this._onSeekListener = [];
			this._onceSeekListener = [];

			this._onEndListener = [];
			this._onceEndListener = [];

			this._onPlayerrorListener = [];
			this._oncePlayerrorListener = [];

			this._onLoaderrorListener = [];
			this._onceLoaderrorListener = [];

			this._onNewPlaylistListener = [];
			this._onceNewPlaylistListener = [];

			this._onNewIndexListener = [];
			this._onceNewIndexListener = [];
		}
	}

	private emit(type: playerServiceEventType) {
		const event: playerServiceEvent = {
			type,
			state: {
				position: this.position,
				percentage: this.percentage,
				index: this.index,
				playing: this._isPlaying,
			} as playerState,
		};
		this.playerStateChangedCallback(event);
		this.eventDispatchCallback(event);
	}

	private unload() {
		if (this.playlist.length >= 4) {
			const length = this.playlist.length;
			const before = this.index === 0 ? length - 1 : this.index - 1;
			const after = this.index === length - 1 ? 0 : this.index + 1;
			for (let i = 0; i < length; i++) {
				if (i != this.index && i != before && i != after) {
					this.unloadSong(this.playlist[i]);
				} else {
					if (!(this.playlist[i].valid === false)) {
						this.createHowlWithBindings(this.playlist[i]);
					}
				}
			}
		}
	}
}

enum playerServiceEventType {
	'play' = 'play',
	'pause' = 'pause',
	'stop' = 'stop',
	'next' = 'next',
	'prev' = 'prev',
	'seek' = 'seek',
	'end' = 'end',
	'newIndex' = 'newIndex',
	'playerror' = 'playerror',
	'loaderror' = 'loaderror',
	'newPlaylist' = 'newPlaylist',
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
