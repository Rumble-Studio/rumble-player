import { RumblePlayer } from './player';

const playlist = ['song1', 'song2', 'song3'];
const songDurations = [50, 100, 2000];

window.HTMLMediaElement.prototype.play = () => {
	return Promise.resolve();
};
window.HTMLMediaElement.prototype.pause = () => {
	/* do nothing */
};

describe('Instanciation', () => {
	it('should create an empty player not playing', () => {
		const player = new RumblePlayer();
		expect(player).toBeDefined();
		expect(player.index).toEqual(-1);
		expect(player.getPlaylistAsString()).toEqual([]);
		expect(player.isPlaying).toEqual(false);
	});

	it('should add the player to the DOM', () => {
		// Adding dummy elements
		document.body.innerHTML =
			'<div> <span id=“username” /><button id=“button” /> </div>';

		// Instancing the player
		const player = new RumblePlayer();

		// Appending the player to the DOM
		document.body.appendChild(player);
		const playerID = 'rs-player';
		player.setAttribute('id', playerID);

		expect(document.getElementById('button')).toBeDefined();
		expect(document.getElementById(playerID)).toBeDefined();
	});
});

describe('Playing behaviors', () => {
	it('should fill the player with a playlist', () => {
		const player = new RumblePlayer();
		player.setPlaylistFromString(playlist);

		expect(player.getPlaylistAsString()).toEqual(playlist);
	});

	it('should be playing when when we click on play', async () => {
		const player = new RumblePlayer();

		// Testing to play without a playlist
		await player.play();
		expect(player.isPlaying).toEqual(false);

		// Testing with a playlist
		player.setPlaylistFromString(playlist);
		await player.play();
		expect(player.isPlaying).toEqual(true);
	});

	it('should stop playing when click on pause', async () => {
		const player = new RumblePlayer();
		player.setPlaylistFromString(playlist);

		await player.play();
		expect(player.isPlaying).toEqual(true);
		setTimeout(() => {
			player.pause();
			expect(player.isPlaying).toEqual(false);
		}, 3000);
	});

	it('should stop playing when click on stop', async () => {
		const player = new RumblePlayer();

		player.setPlaylistFromString(playlist);
		await player.play();
		expect(player.isPlaying).toEqual(true);
		setTimeout(() => {
			player.stop();
			expect(player.isPlaying).toEqual(false);
		}, 1000);
	});

	it('should play next song automatically', async () => {
		const player = new RumblePlayer();
		const deltaT = 2;
		player.setPlaylistFromString(playlist);
		await player.play();
		// Playing song index should be 0 in the playlist
		expect(player.index).toEqual(0);
		// Simulate playing song until end and check if auto play next has changed playlist index
		setTimeout(() => {
			expect(player.index).toEqual(1);
			expect(player.isPlaying).toEqual(true);
		}, songDurations[0] + deltaT);

		// because HTMLAudioPlayer is not implemented in testing environment
		// We trigger ourselves the onended event
		setTimeout(() => {
			const event = new Event('onended');
			player.audio.dispatchEvent(event);
		}, songDurations[0]);
	});
});

describe('Seeking behaviors', () => {
	it('should change the position when seeking', async () => {
		const player = new RumblePlayer();
		player.setPlaylistFromString(playlist);

		await player.play();

		// seeking in pause mode only as audio player is not mocked in testing env:
		player.pause();
		const timeToSeek = 40;
		player.seek(timeToSeek);
		expect(player.getSeekingTime()).toEqual(timeToSeek);
	});

	it('should not change the playing status when seeking', async () => {
		const player = new RumblePlayer();
		player.setPlaylistFromString(playlist);
		await player.play();
		expect(player.isPlaying).toEqual(true);

		// seek while playing
		player.seek(6);
		expect(player.isPlaying).toEqual(true);

		// seek while in pause
		player.pause();
		expect(player.isPlaying).toEqual(false);
		player.seek(30);
		expect(player.isPlaying).toEqual(false);
	});

	it('should go to the end of the song if seeking time over song duration', async () => {
		const deltaT = 10;
		const player = new RumblePlayer();
		const mockSeekFunction = jest.fn((index: number, seconds: number) => {
			if (seconds > songDurations[index]) {
				player.next();
			} else {
				player.seek(seconds);
			}
		});
		player.setPlaylistFromString(playlist);
		await player.play();
		player.pause();

		// first lets try with a value lesser than song duration
		const index = player.index;
		mockSeekFunction(index, songDurations[index]);
		expect(player.index).toEqual(index);

		// Then let's try with a value greather than song duration
		mockSeekFunction(index, songDurations[index] + deltaT);
		expect(player.index).toEqual(index + 1);
	});
});
