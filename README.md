

# RumblePlayer


### Features
* Single audio file or playlist
* Accept all audio codecs / formats


# Documentation

### Contents
* [Quick Start](#quick-start)
* [Examples](#examples)
* [Events](#events)

### Quick Start

Several options to get up and running:

* Clone the repo: `git clone https://github.com/Rumble-Studio/rumble-player.git`
* Install with [npm](https://www.npmjs.com/package/howler): `npm install rumble-player`
* Install with [Yarn](https://yarnpkg.com/en/package/howler): `yarn add rumble-player`

In the browser:

Using pure HTML
```html
<rumble-player
  id="rs-player-id"
  />
```
Using js

```html

<div id='rs-player-id'></div>
<script>
  import { HTMLRumblePlayer, RumblePlayerService } from '@rumble-player/rp';

  let container = document.getElementById('rs-player-id')
  // create the player custom element
  let player = new HTMLRumblePlayer()
  //add it to the container
  container.appendChild(player)
  // create the service
  let service = new RumblePlayerService()
  // set the service to the player
  player.setPlayer(service)
  // load a layout config
  player.loadConfig('config6')
  load a playlist
  service.setPLaylistFromRSSFeedURL('rss url')
</script>
```

As a dependency using React:

in main.tsx or main.js:
````javascript
import '@rumble-player/rp'
````
in your component
```typescript jsx
import {
  RumblePlayerService,
  HTMLRumblePlayer,
} from '@rumble-player/rp';

export default class MyComponent extends React.Component{

  // HTML Player container
	private containerRef = React.createRef<HTMLRumblePlayer>();
  
	// Player Service
  private player = new RumblePlayerService();
  // Player html custom element
  private playerHTML = new HTMLRumblePlayer();

  componentDidMount() {
    this.playerHTML = new HTMLRumblePlayer();
    this.player = new RumblePlayerService();
    // Set the service to the player
    this.playerHTML.setPlayer(this.player);
    // Load layout config number 6
    this.playerHTML.loadConfig('config6');
    // Insert the HTML player into DOM
    (this.containerRef.current as HTMLRumblePlayer).replaceWith(
      this.playerHTML
    );
    // Load playlist from RSS
    this.player.setPLaylistFromRSSFeedURL('https://feeds.buzzsprout.com/159584.rss')

  }
  render(){
  return(
    <rumble-player
      ref={this.containerRef as React.RefObject<HTMLRumblePlayer>}
    />
  )
}
}
```

As a dependency using Angular:

in main.tsx:
````javascript
import '@rumble-player/rp'
````
in app.module :
```javascript
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // add this import

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // ADD this line
})

```
in your template
```angular2html
<div class="playerContainer" #playerContainer>
  <rumble-player #playerHTML> </rumble-player>
</div>

```

in your component class
````typescript
import {
  RumblePlayerService,
  HTMLRumblePlayer,
} from '@rumble-player/rp';
export class PlayerComponent implements AfterViewInit {

  public player: RumblePlayerService;

  @ViewChild('playerHTML')
  playerHTML: ElementRef<HTMLRumblePlayer> | undefined; // to access the custom element

  public eventsHistory: string[];
  public RSSLink: string;
  
  constructor() {

    this.player = new RumblePlayerService(); // instanciate player service
    this.RSSLink = 'https://feed.rumblestudio.app/collection/xjIPbCryeIQpV3ut5dXb';
  }

  ngAfterViewInit() {
    // it is important to do these operation from or after ngAfterViewInit

    if (this.playerHTML) {
      // set the the audio service to the custom element
      this.playerHTML.nativeElement.setPlayer(this.player);

      // load the  predefined layout configuration  config6
      this.playerHTML.nativeElement.loadConfig('config6');

      // load playlist from RSS FEED
      this.player.setPLaylistFromRSSFeedURL(this.RSSLink)

      // or load playlist from local object
      this.player.setPlaylistFromObject(fakePlaylistWithImage);
    }
  }	
	
}
````

### Predefined Layout configs

There are 6 predefined layout configs.
Each layout configuration defines the layout elements to show within the player
Such elements are called visuals in the context of rumble player.
Visual are custom HTML Elements that interact with the player service. Such elements can be button controls,
or image art of a song or podcast episode or even seekbar and timers.

Find below a list of predefined Visuals

### Predefined visuals

Each visual inherits from The GenericVisual class within src/lib/visuals.
In buttons subfolder there are player control buttons : play/stop/pause/next/prev/forward/prev
In linear subfolder ther are the linear bar and SimpleMultilinear for Playlists
Simpleplaylist : Playlist Visual
SimpleImage : Album art picture, it also loads the picture of the playing episode from podcast playlist
SImpleTimeTotal : Total time of actual playing song
SImpleTimeSpent : played time of actual playing song
SImpleTimeLeft : ETA of actual playing song

You can create as much as Visual you want in order to customize and add new features to the player
Just dont forget to make it extend Generic Visual and define the it's custom element

### Known issues 
 Template parse errors:
    'rumble-player-player' is not a known element:
    1. If 'rumble-player-player' is an Angular component, then verify that it is part of this module.
    2. If 'rumble-player-player' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message. ("[ERROR ->]<rumble-player-player></rumble-player-player>

https://stackoverflow.com/questions/39428132/custom-elements-schema-added-to-ngmodule-schemas-still-showing-error

This project was generated using [Nx](https://nx.dev).

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Nx is a set of Extensible Dev Tools for Monorepos.**

## Quick Start & Documentation


[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/angular/getting-started/what-is-nx)

[Interactive Tutorial](https://nx.dev/angular/tutorial/01-create-application)

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [Angular](https://angular.io)
  - `ng add @nrwl/angular`
- [React](https://reactjs.org)
  - `ng add @nrwl/react`
- Web (no framework frontends)
  - `ng add @nrwl/web`
- [Nest](https://nestjs.com)
  - `ng add @nrwl/nest`
- [Express](https://expressjs.com)
  - `ng add @nrwl/express`
- [Node](https://nodejs.org)
  - `ng add @nrwl/node`

There are also many [community plugins](https://nx.dev/nx-community) you could add.

## Generate an application

Run `ng g @nrwl/angular:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `ng g @nrwl/angular:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@rumble-player/mylib`.

## Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component.

## Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.






## ☁ Nx Cloud

### Computation Memoization in the Cloud

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
