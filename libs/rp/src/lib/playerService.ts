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
		this.dispatchPlayerEvent(playerServiceEventType.newPlaylist);
		this.preloadPlaylist();
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
		return this.playlist.map((s) => s.id).indexOf(song.id);
	}

	updatePositions() {
		if (this.playlist.length === 0) return;
		let duration = 0;
		this.playlist.forEach((song: Song, songIndex: number) => {
			if (song.howl && song.valid) {
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

	createHowlWithBindings(song: Song, index = -1): Howl | null {
		// Extract the file extension from the URL or base64 data URI.
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		console.log('HOWL CREATING');
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
				this.playingOff();
				if (index > -1) {
					this.playlist[index].valid = false;
					this.playlist[index].loaded = false;
				}
			},
			onload: () => {
				console.log('LOADED');
				if (index > -1) {
					this.playlist[index].valid = true;
					this.playlist[index].loaded = true;
				}
				song.onload(song);
			},
			onloaderror: (error) => {
				console.warn(
					'error howler loading',
					error,
					this.playlist[index].howl.duration()
				);
				this.playingOff();
				if (index > -1) {
					this.playlist[index].valid = true;
					this.playlist[index].loaded = true;
				}
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

	preloadPlaylist() {
		this.playlist.forEach(
			(song, index) => (song.howl = this.createHowlWithBindings(song, index))
		);
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
				this.dispatchPlayerEvent(playerServiceEventType.stop);
			}
		} else {
			// we stop all songs in the playlist (several can play together)
			this.playlist.forEach((song: Song, songIndex: number) => {
				if (song.howl && song.valid) {
					song.howl.stop();
					this.dispatchPlayerEvent(playerServiceEventType.stop);
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
		const isPlaying = this.isPlaying;
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
		this.dispatchPlayerEvent(playerServiceEventType.next);
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
				this.dispatchPlayerEvent(playerServiceEventType.play);
				return;
			}
		}

		// remember value before stopping
		const isPlaying = this.isPlaying;

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
		this.dispatchPlayerEvent(playerServiceEventType.prev);
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
	public generateSongFromUrl(url: string, index: number) {
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
				console.log('RSS Decoded', songList.slice(0, 10));
				this.setPlaylistFromObject(songList.slice(0, 10));
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
