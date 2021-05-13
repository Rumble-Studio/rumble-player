import { Howl } from 'howler';
import { v4 as uuidv4 } from 'uuid';

export const UPDATE_DELAY = 100;

export interface Song {
	id?: string; // unique id to identify the song even when we add new song to the playlist
	title?: string;
	file?: string;
	howl?: Howl | null;
	duration?: number | null;
	loaded?: boolean;
	valid?: boolean;
	image?: string | null;
	author?: string;
	albumArt?: string;
	playlistName?: string;
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

export class PlayerService {
	// automatically play next song
	autoPlayNext = true;

	// get if selected song is being played
	private _isPlaying = false;
	get isPlaying() {
		return this._isPlaying;
	}
	set isPlaying(newPlayingState: boolean) {
		if (this._isPlaying == newPlayingState) return;
		this._isPlaying = newPlayingState;
		if (this._isPlaying) {
			this.emit(playerServiceEventType.play);
		}
		if (!this._isPlaying) {
			this.emit(playerServiceEventType.pause);
		}
	}

	// Automatically play on load
	autoPlay = false;
	// Loop the playing sound when it ends
	loop = false;
	// Wether or not to shuffle the playlist
	_shuffle = false;
	get shuffle() {
		return this._shuffle;
	}
	set shuffle(value: boolean) {
		if (!this.playlist || this.playlist.length === 0) return;
		this._shuffle = value;
		if (!value) {
			this._shuffledPlaylist = Object.assign([], this._playlist);
		} else {
			this.shufflePlaylist();
			while (
				this._shuffledPlaylist.every(
					(value1, index1) => this._playlist[index1] === value1
				)
			) {
				this.shufflePlaylist();
			}
		}
		this.emit(playerServiceEventType.newPlaylist);
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

	// VOLUME
	private _volume = 1;
	get volume() {
		return this._volume;
	}
	set volume(level: number) {
		if (level <= 1 && level >= 0) {
			this._volume = level;
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

	// index in playlist
	private _index: number;
	get index() {
		return this._index;
	}
	set index(value: number) {
		if (value == this._index) return;
		this._index = value;
		this.emit(playerServiceEventType.newIndex);
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
	set duration(newDuration: number) {
		if (this._duration == newDuration) return;
		this._duration = newDuration;
	}

	// CURRENT PERCENTAGE
	private _percentage: number;
	get percentage() {
		return this._percentage;
	}
	set percentage(newPercentage: number) {
		if (this._percentage == newPercentage) return;
		this._percentage = newPercentage;
	}

	// CURRENT POSITION
	private _position: number;
	get position() {
		return this._position;
	}
	set position(newPosition: number) {
		if (this._position == newPosition) return;
		this._position = newPosition;
		let duration = 0;
		if (this.playlist[this.index].howl) {
			duration = this.playlist[this.index].howl.duration();
		}
		this._percentage = duration > 0 ? this.position / duration : 0;
		this.emit(playerServiceEventType.newPosition);
	}

	constructor() {
		this._playlist = [];
		this._shuffledPlaylist = [];
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
		this.playlist.forEach((song: Song) => {
			if (song.howl && song.valid && song.loaded) {
				song.position = song.howl.seek() as number;
			} else {
				song.position = -1;
			}
		});
		this.position = this.playlist[this.index].position;
	}

	getSong(index: number, instanciateHowlIfMissing = true) {
		let song = this.playlist[index];
		if (!song.valid) {
			// song invalid is return as it is without loading any more howl
			return song;
		}

		if (!song.howl && instanciateHowlIfMissing) {
			song = this.createHowlWithBindings(song, index);
			if (!song.howl) {
				song.valid = false;
			}
		}
		return song;
	}

	private createHowlWithBindings(song: Song, index: number): Song | null {
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
			this.playlist[index].valid = false;
			this.playlist[index].loaded = false;
			return null;
		}
		const howl = new Howl({
			src: [song.file],
			html5: true,
			onplayerror: (error) => {
				console.error('error howler playing', error);
				this.emit(playerServiceEventType.playError);

				if (index == this.index) {
					this.isPlaying = false;
				}

				song.valid = false;
				song.loaded = false;
			},
			onload: () => {
				song.valid = true;
				song.loaded = true;

				if (index === 0 && this.autoPlay) this.play(0);

				if (song.onload) song.onload(song);
			},
			onloaderror: (error) => {
				console.warn('error howler loading', error);
				this.emit(playerServiceEventType.loadError);
				song.valid = true;
				song.loaded = true;
			},
			onend: () => {
				if (this.loop) {
					this.seekPerPercentage(0);
					this.emit(playerServiceEventType.endOfSong);
					this.play();
					return;
				}
				if (this.autoPlayNext) this.next();
				else {
					this.stop();
				}
				this.emit(playerServiceEventType.endOfSong);
			},
			onpause: () => {
				if (index == this.index) {
					this.isPlaying = false;
				}
			},
			onplay: () => {
				if (index == this.index) {
					this.isPlaying = true;
				}
			},
			onseek: () => {
				//
			},
		});
		song.howl = howl;
		return song;
	}

	preloadPlaylist() {
		if (this.unloadAll) {
			this.unload();
			return;
		}
		this.playlist.forEach((song, index) => {
			song = this.createHowlWithBindings(song, index);
		});
	}
	unloadSong(song: Song) {
		if (song.valid && song.howl) {
			song.howl.unload();
			song.loaded = false;
		}
	}
	loadSong(song: Song) {
		if (song.valid && song.howl) {
			song.howl.load();
			song.loaded = true;
		}
	}
	addSong(url: string) {
		const index = this.playlist.length;
		const song = this.generateSongFromUrl(url, index);
		const newPlaylist = this.playlist;
		newPlaylist.push(song);

		this.playlist = newPlaylist;
		this.playlist[index] = this.createHowlWithBindings(song, index);
	}

	// should return as a promise the current index asked to be played
	public play(index?: number): Promise<number> {

		if (index > -1 && index < this.playlist.length) {
			this.index = index;
		}

		// if no playlist index is -1
		if (this.playlist.length === 0) return Promise.resolve(-1);

		const indexToPlay = this.index;

		// Check howl instance to play
		const song = this.getSong(indexToPlay);

		if (song.howl && !song.valid) {
			return;
		}
		this.isPlaying = true;

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
	public playWithOptions(options) {
		if (options.index !== undefined) {
			this.play(options.index);
		} else {
			this.play();
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
				this.isPlaying = false;
				this.emit(playerServiceEventType.stop);
			}
		} else {
			// we stop all songs in the playlist (several can play together)
			this.playlist.forEach((song: Song) => {
				if (song.howl && song.valid) {
					song.howl.stop();
					this.isPlaying = false;
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
			this.emit(playerServiceEventType.play);
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
			this.loadSong(this.playlist[indexToLoad]);
			this.unloadSong(this.playlist[indexToUnLoad]);
		}
		this.emit(playerServiceEventType.next);
	}

	public prev() {
		if (this.playlist.length === 0) return;

		const song = this.getSong(this.index);
		if (song.howl && song.valid) {
			const currentPosition = song.howl.seek() as number;
			if (currentPosition > 2) {
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
		if (this.playlist.length === 0) return;

		let indexToSeek = this.index;
		if (index !== undefined && index > -1 && index < this.playlist.length) {
			indexToSeek = index;
		}
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

		if (this.playlist.length === 0) return;

		let indexToSeek = this.index;
		if (index !== undefined && index > -1 && index < this.playlist.length) {
			indexToSeek = index;
		}
		const song = this.getSong(indexToSeek);

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
				playlistName: object.playlistName,
				author: object.author,
				albumArt: object.albumArt,
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
				const channel = dom.documentElement
					.getElementsByTagName('channel')
					.item(0);
				const playlistName = channel.querySelector('title').textContent;
				const author = channel.getElementsByTagName('itunes:author').item(0)
					.textContent;
				//const albumArt = channel.querySelector('image').querySelector('url').textContent
				let albumArt = this.extractImage(channel);
				dom.documentElement
					.querySelectorAll('item')
					.forEach((value, key) => {
						const title = value.querySelector('title').textContent;
						const file = value
							.querySelector('enclosure')
							.getAttribute('url');
						// const image = value
						// 	.getElementsByTagName('itunes:image')
						// 	.item(0)
						// 	.getAttribute('href');
						let image = this.extractImage(value);
						if (image === null && albumArt) image = albumArt;
						if (albumArt === null && image) albumArt = image;

						const song = {
							title,
							file,
							image,
							playlistName,
							author,
							albumArt,
						};
						songList.push(song);
					});
				this.setPlaylistFromObject(songList);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	private extractImage(elt: Element) {
		try {
			const simpleImage = elt.querySelector('image');

			if (simpleImage) {
				const url = simpleImage.querySelector('url');
				if (url) {
					return url.textContent;
				}
			}
		} catch (e) {
			console.warn(e);
		}
		try {
			const itunesImage = elt.getElementsByTagName('itunes:image');
			if (itunesImage) {
				const img = itunesImage.item(0);
				if (img) {
					const url = img.getAttribute('href');
					return url;
				}
			}
		} catch (e) {
			console.warn(e);
		}
		return null;
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
	}

	/* CALLBACKS ON UPDATE */

	addNewOnCallback(callback: (event: playerServiceEvent) => void) {
		if (this.playingEventsCallbacks.some((value) => value === callback)) {
			console.warn('Callback already present: ignored');
			return;
		}

		this.playingEventsCallbacks.push(callback);
	}
	/* CALLBACKS ON STATE CHANGE */
	private playingEventsCallbacks: ((event: playerServiceEvent) => void)[] = [];
	private playerStateChangedCallback(event: playerServiceEvent) {
		this.playingEventsCallbacks.forEach((callback) => {
			callback(event);
		});
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
						this.createHowlWithBindings(this.playlist[i], i);
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
	'endOfSong' = 'endOfSong', // end of a specific song is reached
	'newPosition' = 'newPosition',
	'newIndex' = 'newIndex',
	'playError' = 'playError',
	'loadError' = 'loadError',
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
