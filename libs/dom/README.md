# RumblePlayer by [Rumble Studio](#https://rumble.studio)

## Player As a Service

Rumble player is an open source audio player for the web, ready to use you can seamlessly integrate into any web project.

## Existing solutions

There are few audio players out there like :

-  [Green Audio Player](#https://github.com/greghub/green-audio-player) : simple, but too simple as there is no way to add multiple song and have a playlist
   each time we want to change a song we have change its DOM attributes. very limited
-  [HTML Audio Player](#https://codepen.io/vanderzak/pen/BayjVep) : has playlist support, but require manual manipulation, don't support album art
-  [Vanilla JS Audio Player](#https://github.com/kotaid/vanilla-js-audio-player) : better than the two other since it supports playlist , album art and has an add button,
   but comes with it's own limitation : it does not expose an API for interaction, and THE UI is not customizable

All the players above also share a common problem : Very difficult and error prone if not impossible to integrate them into existing
project without breaking it. They are all designed for a very specific use case and tech stack

This lack of extensibility motivated us at Rumble Studio to build a more complete solution to address this need.
A highly customizable audio player, exposing a powerfull for more control and flexibility.

### Features

-  Seamless integration in Vanilla JS and React/Angular or any other NodeJS framework
-  Single audio file or playlist
-  Accept all audio codecs / formats
-  Built in playlist support
-  Load Playlist from podcast formatted RSS Feed
-  Load Playlist from an array of MP3 files URI
-  Load Playlist with Album Picture and Artist/Album name
-  Auto Caching : Song are Loaded and Cached automatically
-  A Service for Managing player Across all application
-  Comprehensive API Through the player service
-  Subscribe to Player events
-  Optional default HTML implementation


## Live Demo
We made this podcast loader demo to showcase the power of rumble player, just pass it the RSS Feed URL of a podcast, and it will
load the whole including episodes image


![](rp.gif)

[Click here to preview the demo](#https://rpdemo-1.web.app)

# Examples Usage
Several ways to get started depending on your needs:


## Method 1:
##### Most basic example using playerService

#### Using Vanilla JS

```html
// load the lib
<script src="https://unpkg.com/@rumble-player/service" />
<script>
	import { PlayerService } from '@rumble-player/service';

	// create the service
	let player = new PlayerService();

	// load a song
	player.addSong('song file uri');

	// start playing
	player.play();
</script>
```

That is it, you can play your audio tracks, subscribe to playing events

### For a JS framework ( React or Angular ):
-  Install with [npm](https://www.npmjs.com/package/howler): `npm install @rumble-player/service`


#### As a dependency using React:

in main.tsx or main.js:

```javascript
import '@rumble-player/service';
```

in your component

```typescript jsx
import { PlayerService } from '@rumble-player/service';
import { useEffect } from 'react';

// Using Class Component
class MyComponent extends React.Component {
	// Player Service
	private player = new PlayerService();

	componentDidMount() {
		this.player = new PlayerService();
		// Load a song
		this.player.addSong('song file uri');
		// Load a song
		this.player.play();
	}
}

// Using function component

function MyComponent() {
	const player = new PlayerService();
	useEffect(() => {
		player = new PlayerService();
		// Load a song
		player.addSong('song file uri');
		// Load a song
		player.play();
	});
}
```

#### As a dependency using Angular:

in main.ts:

```javascript
import '@rumble-player/service';
```

in your component class

```typescript
import { PlayerService } from '@rumble-player/service';
export class PlayerComponent implements AfterViewInit {
	public player: PlayerService;

	constructor() {
		this.player = new PlayerService(); // instanciate player service
	}
	ngOnInit() {
		// Load a song
		this.player.addSong('song file uri');
		// Load a song
		this.player.play();
	}
}
```

###More features

this applies to both VanillaJS / Angular / React or any other JS Front Framework

##### Load from multiple type of source

```javascript
// load a playlist from multiple song uri
player.setPlaylistFromUrls(['song 1', 'song 2']);
// load a playlist from RSS FEED
player.setPLaylistFromRSSFeedURL('rss feed url');

// load playlist with song urls and image art

const playlist = [
	{
		title: 'Track 1',
		file: 'file 1 url',
		image: 'song 1 picture url',
    albumArt: 'album 1 picture url',
    playlistNAme: 'album 1 name'
	},
	{
		title: 'Track 2',
		file: 'file 2 url',
    image: 'song 2 picture url',
    albumArt: 'album 2 picture url',
    playlistNAme: 'album 2 name'
	},
];
player.setPlaylistFromObject(playlist);

```

##### Subscribe to events

Find the complete list of events and data passed in the API section below.

```javascript
// functions to be called each time an event occurs

const onEvent = (event: playerServiceEvent) => {
	// whenver something happens it emit the details below
	const { percentage, index, playing, position } = event.state;
	
	// there 10 type of events, find the complete list in API section
	const eventType:  playerServiceEventType = event.type
	// Do something
};


// Add event listener to call each time event occurs
// you can add as much as listeners as you need
const player = new playerService()
player.addNewOnCallback(onEvent)



```


## Method 2:
##### Using both playerService and PlayerHTML

-  Install with [npm](https://www.npmjs.com/package/howler): `npm install @rumble-player/dom`

For this method we will use the @rumble-player/dom library, it brings more compared to the first one when
it comes to events subscriptions, since here we can subscribe to the player events using the traditional DOM
eventListeners add and remove methods. Check the code snippets below :

#### Using Vanilla JS

```html
// load the lib
<script src="https://unpkg.com/@rumble-player/dom" /> 
```

#### Using Angular
in main.ts :

```javascript
import '@rumble-player/dom';
```


#### Using React
in main.tsx or main.js:

```javascript
import '@rumble-player/dom';
```


```javascript

// We also import the playerHTML class
import { PlayerService, PlayerHTML } from '@rumble-player/dom';

	// create the service
	let player = new PlayerService();

  // create the playerHTML
  let playerHTML = new PlayerHTML();

  // This step is essential In order to subscribe to events
	playerHTML.setPlayerService(player)


  // functions to be called each time an event occurs

  const onPlay = (event: playerServiceEvent) => {
    const { percentage, index } = event.state;
    // Do something whenever a song is played
  };
  const onPause = (event: playerServiceEvent) => {
    const { percentage, index } = event.state;
    // Do something else whenever a song is paused
  };
  

  // Add event listener to call each time event occurs
  playerHTML.addEventListener('play', onPlay);
  playerHTML.addEventListener('pause', onPause);
```

As you can see, this library contains the features of the one in Method 1, but also had a class playerHTML
which enables us to subscribe and subscribe to events using the traditional way.

Find the available methods of playerHTML in the API section

## Interfaces

```typescript
interface playerState {
	position: number;
	percentage: number;
	index: number;
	playing: boolean;
}

interface playerServiceEvent {
	type: playerServiceEventType;
	state: playerState;
}

interface Song {
  title?: string; // song title
  file?: string; // song file URI
  loaded?: boolean; // is True when song is loaded
  valid?: boolean; // is True when file URI points to a valid audio file
  image?: string | null; // song image URI
  author?: string;  // For podcasts : author
  albumArt?: string; // album picture URI
  playlistName?: string; // album name
  position?: number | null; // current seeking of position of the howl
}

```

## Complete API

##### PlayerService and PlayerHTML share the same public properties and methods

The Lib exposes two classes : PlayerHTNL and PlayerService.
as showed above.
Use the PlayerService in order to load audios and control it. If you also need to subscribe to the player events,
then you should also use PlayerHTML since it let's you subscribe to the player events using normal dom listeners.
All you have to do is use our predefined events name. you will find below a complete list of those events.

#### Properties


-  `autoPlayNext boolean [true]`
   if true, automatically play next song in playlist when actual song ends and loop entire playlist
-  `isPlaying : private boolean [false]`
   true if there is a song playing
-  `autoPlay : boolean [true]`
   automatically play first song on playlist load
-  `loop : boolean [false]`
   loop playing song
-  `rate : number 1`
   Playback speed, value between 0 and 4, 1 being the normal speed
-  `volume : number [1]`
   playback volume between 0 and 1.


complete list of events :

-  `play`
-  `pause`
-  `stop`
-  `next`
-  `prev`
-  `seek`
-  `endOfSong`
-  `newIndex`
-  `newPlaylist`
-  `newPosition`
-  `loaderror`
-  `playerror`

#### Methods

-  **`volume([level: number])`**: Get/Set volume level with a value between 0 and 1
-  **`index([index: number])`**: Get/set the index of playing head in playlist
-  **`playlist(): <Song>[]`**: Get the playlist
   Get more details on Song in the Interface section

-  **`percentage(): number`**: Get the percentage played of the actual playing song
-  **`position(): number`**: Get the duration played of the actual playing song
-  **`getRank(song: Song): number`**: Get the index in the playlist of the actually playing song
-  **`getSong(index: number, [instanciateHowlIfMissing = true]): Song`**: Get the song at index in the playlist. the instanciateHowlIfMissing parameter forces the loading of the song if not yet
-  **`preloadPlaylist()`**: Forces the player to load every track in the playlist
-  **`addSong(songUrl: string)`**: Add a new song in the playlist
-  **`play([index]: number): Promise<number>`**: play the song at index in the playlist, default plays the first song
-  **`pause([options: { index?: number; pauseOthers?: boolean }])`**: pauses song at index, if pauseOthers will also pause all the song in the playlist. by default it will pause everything
-  **`next()`**: play next song in the playlist , if last song it will loop and play first one
-  **`prev()`**: play previous song in the playlist if actual song has not played more than 2 seconds, otherwise will rewind to the beginning of actual playing song. if last song it will loop backward and play first one
-  **`stop([index]: number)`**: stop the song at index, otherwise will stop the actual playing

-  **`seekPerPercentage(percentage: number, [index: number])`**: seek the song at index in the playlist to percentage, by default will seek the actual playing song
-  **`seekPerPosition(position: number, [index: number])`**: seek the song at index in the playlist to position, by default will seek the actual playing song
-  **`getSongTimeLeft([index: number])`**: Get The ETA of song at index in the playlist , default will return the ETA of actual playing song
-  **`getSongTotalTime([index: number])`**: Get The total duration of song at index in the playlist , default will return the total duration of actual playing song
-  **`setPlaylistFromUrls(urls: string[])`**: Set new playlist from song urls
-  **`setPlaylistFromObject(data: any[])`**: Set new playlist from song including more details. Each element in data is an object {title: songTitle, image: imageUrl, file: songUrl}
-  **`setPLaylistFromRSSFeedURL(url: string)`**: Set new playlist from podcast formatted RSS FEED
