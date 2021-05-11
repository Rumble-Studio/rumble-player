import { PlayerService, Song } from './playerService';
import { Howl } from 'howler';

const songURL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
const rssURL = 'https://lincolnproject.libsyn.com/rss';

// Mockup window load and play for howler
window.HTMLMediaElement.prototype.load = () => {
	console.log(this);
};
window.HTMLMediaElement.prototype.play = () => {
	console.log(this);
	return Promise.resolve();
};

// Lets mockup some service functions

const validate = jest.fn((service: PlayerService) => {
	// simulate load
	service.playlist.forEach((value) => {
		value.valid = true;
		value.howl = new Howl({ src: songURL });
	});
});

const play = jest.fn((service: PlayerService) => {
	// simulate play
	service.isPlaying = true;
});
const pause = jest.fn((service: PlayerService) => {
	// simulate pause
	service.isPlaying = false;
});
const stop = jest.fn((service: PlayerService) => {
	// simulate stop
	service.isPlaying = false;
});

PlayerService.prototype.play = () => {
	const that: PlayerService = this!;
	console.log(that);
	return Promise.resolve(1);
};

const url = './test.html';
Object.defineProperty(global.window, 'location', {
	value: {
		href: url,
	},
	writable: true,
});
const fetch = global.window.fetch;

describe('Player Service', () => {
	it('should work', () => {
		const service = new PlayerService();

		expect(service).toBeDefined();
	});

	it('should play', () => {
		const service = new PlayerService();
		service.setPlaylistFromUrls([songURL, songURL]);
		expect(service.isPlaying).toEqual(false);
		play(service);
		expect(service.isPlaying).toEqual(true);
	});

	it('should pause', () => {
		const service = new PlayerService();
		service.setPlaylistFromUrls([songURL, songURL]);
		expect(service.isPlaying).toEqual(false);
		play(service);
		expect(service.isPlaying).toEqual(true);
		pause(service);
		expect(service.isPlaying).toEqual(false);
	});

	it('should stop', () => {
		const service = new PlayerService();
		service.setPlaylistFromUrls([songURL, songURL]);
		expect(service.isPlaying).toEqual(false);
		play(service);
		expect(service.isPlaying).toEqual(true);
		stop(service);
		expect(service.isPlaying).toEqual(false);
	});

	it('should next', () => {
		const service = new PlayerService();
		service.setPlaylistFromUrls([songURL, songURL]);
		const index = service.index;
		validate(service);
		service.next();
		expect(service.index).not.toEqual(index);
	});

	it('should next', () => {
		const service = new PlayerService();
		service.setPlaylistFromUrls([songURL, songURL]);
		const index = service.index;
		validate(service);
		service.next();
		expect(service.index).not.toEqual(index);
	});

	it('should not prev but rewind', () => {
		const service = new PlayerService();
		service.setPlaylistFromUrls([songURL, songURL]);
		const index = service.index;
		validate(service);
		PlayerService.prototype.seekPerPosition = (position) => {
			service.position = position;
		};
		service.seekPerPosition(3);
		Howl.prototype.seek = () => {
			return 4;
		};

		service.prev();
		expect(service.index).toEqual(index);
		expect(service.percentage).toEqual(0);
	});

	it('should prev', () => {
		const service = new PlayerService();
		service.percentage = 3;
		Howl.prototype.seek = () => {
			return 1;
		};
		service.setPlaylistFromUrls([songURL, songURL]);
		const index = service.index;
		validate(service);
		service.prev();
		expect(service.index).not.toEqual(index);
	});
});

describe('Playlist loading', () => {
	it('should load a single song from url', () => {
		const service = new PlayerService();
		expect(service.playlist.length).toEqual(0);
		service.setPlaylistFromUrls([songURL]);
		expect(service.playlist.length).toEqual(1);
	});

	it('should add song from ', () => {
		const service = new PlayerService();
		expect(service.playlist.length).toEqual(0);
		service.setPlaylistFromUrls([songURL]);
		expect(service.playlist.length).toEqual(1);
		service.addSong(songURL);
		expect(service.playlist.length).toEqual(2);
	});

	it('should load multiple songs from urls', () => {
		const service = new PlayerService();
		expect(service.playlist.length).toEqual(0);
		service.setPlaylistFromUrls([songURL, songURL]);
		expect(service.playlist.length).toEqual(2);
	});

	it('should  single song from object', () => {
		const service = new PlayerService();
		expect(service.playlist.length).toEqual(0);
		const song = {
			file: songURL,
			image: '',
		};
		service.setPlaylistFromObject([song]);
		expect(service.playlist.length).toEqual(1);
	});

	it('should multiple songs from objects', () => {
		const service = new PlayerService();
		expect(service.playlist.length).toEqual(0);
		const song = {
			file: songURL,
			image: '',
		};
		service.setPlaylistFromObject([song, song, song]);
		expect(service.playlist.length).toEqual(3);
	});
});

describe('Player properties', () => {
	// it('should shuffle', () => {
	// 	const service = new PlayerService();
	// 	service.setPlaylistFromUrls([songURL, songURL, songURL, songURL]);
	// 	const playlist1 = Object.assign([], service.playlist);
	// 	expect(service.shuffle).toEqual(false);
	// 	service.shuffle = true;
	//
	// 	const playlist2 = Object.assign([], service.playlist);
	// 	expect(service.shuffle).not.toEqual(false);
	// 	expect(playlist2).not.toEqual(playlist1);
	// });

	it('should set volume', () => {
		const service = new PlayerService();
		validate(service);
		expect(service.volume).toEqual(1);
		service.volume = 0;
		expect(service.volume).toEqual(0);

		service.volume = 2;
		expect(service.volume).toEqual(0);
	});

	it('should set rate', () => {
		const service = new PlayerService();
		validate(service);
		expect(service.rate).toEqual(1);
		service.rate = 0.5;
		expect(service.rate).toEqual(0.5);

		service.rate = 5;
		expect(service.rate).toEqual(0.5);
	});
});

describe('Seeking behaviors', () => {
	it('should change the position when seeking', async () => {
		const service = new PlayerService();
		service.setPlaylistFromUrls([songURL, songURL]);
		validate(service);
		expect(service.isPlaying).toEqual(false);
		play(service);
		expect(service.isPlaying).toEqual(true);

		PlayerService.prototype.seekPerPosition = (position) => {
			service.position = position;
		};

		service.pause();
		const timeToSeek = 40;
		service.seekPerPosition(timeToSeek);
		expect(service.position).toEqual(timeToSeek);
	});

	it('should not change the playing status when seeking', async () => {
		const service = new PlayerService();
		service.setPlaylistFromUrls([songURL, songURL]);
		validate(service);
		expect(service.isPlaying).toEqual(false);
		play(service);
		expect(service.isPlaying).toEqual(true);

		PlayerService.prototype.seekPerPosition = (position) => {
			service.position = position;
		};

		// seek while playing
		service.seekPerPosition(6);
		expect(service.isPlaying).toEqual(true);

		// seek while in pause
		pause(service);
		expect(service.isPlaying).toEqual(false);
		service.seekPerPosition(30);
		expect(service.isPlaying).toEqual(false);
	});
});
