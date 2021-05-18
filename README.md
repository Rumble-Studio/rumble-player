# Rumble Player


**Rumble Player** is an open source HTML5 audio player split in 4 packages (1 mandatory, 3 optional):
- *`@rumble-player/service`: the service contains all the logic to play sound (from an url, a playlist object, an RSS feed, ...), with all the common methods (next, prev, shuffle, volume controls...) and a few extra features (preload, event callbacks, ...)
- `@rumble-player/player`: the player is a simple wrapper around the service to trigger all the events as DOM events (so that you can subscribe to them with the classic `addEventListener`.). This package depends on the `service` package.
- `@rumble-player/elements`: this package show examples of custom HTML elements (linear seek bar, play button, playlists...) you can use them directly or for inspiration. This package depends on the `player`.
- `@rumble-player/configs`: this package allows you to generate ready to use players with pre-defined combination of custom elements or classic HTML elements. It depends on all other packages.

## Install


You must always install the `@rumble-player/service`:

```shell
npm install @rumble-player/service
```

Note: The service has [HowlerJS](https://howlerjs.com/) <img width="100" src="https://howlerjs.com/assets/images/logo.svg"> as a dependency, a javascript library for audio manipulation and UUID to generate some unique ID for playlist processes.

## Usage

### Angular

To use the library within your Angular project the best way is to use an Angular Service

1) Create an angular project with a service
```shell
npm install -g @angular/cli # install Angular
ng new ng-rumble-player # Create a new Angular app
cd ng-rumble-player
ng g s audio # generate a service
```

2) Install the Rumble Player Service package:

```shell
npm install @rumble-player/service
```

3) Import the Rumble Player Service into the Angular service. You can extends the Angular service class from Rumble Player Service or you can create a property `this.player = new PlayerService()`. The following example use the extend option:

In the file `src/app/audio.service.ts`:
```typescript
import { Injectable } from '@angular/core';
import {
  PlayerService,
  playerServiceEvent,
  Song,
} from '@rumble-player/service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioService extends PlayerService {
  public playlist$: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);
  public index$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  public percentage$: BehaviorSubject<number> = new BehaviorSubject(0);
  public position$: BehaviorSubject<number> = new BehaviorSubject(0);
  public playing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
  false
  );

  constructor() {
    super(); // needed as this class extends the Rumble Player Service
    this.addNewOnCallback(this.on);
  }

  private on(event: playerServiceEvent) {
    // We convert the events into RxJS behaviour subject
    // so that you can subscribe to them the way you want.
    console.log('[audioService](on) new event:', event);
    this.playing$.next(this.isPlaying);
    this.index$.next(this.index);
    this.position$.next(this.position);
    this.percentage$.next(this.percentage);
  }
}

```


All events will trigger the `on` method in this example (new playlist, play, pause,...). You can filter on the event.type property, debounce the observables (see [debounceTime](https://rxmarbles.com/#debounceTime)) or filter if not distinct (see [distinctUntilChanged](https://rxmarbles.com/#distinctUntilChanged)) to avoid unnecessary observable triggers.

A list of events is available further.

4) Once you have an Angular service you can inject it in your components:

```typescript
import { Component } from '@angular/core';
import { AudioService } from './audio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-rumble-player';

  constructor(private audioService:AudioService){
    ...
  }
}
```

5) Give something to play to your service:


 

### React

***not done yet***

### Vue

***not done yet***

### Vanilla HTML

***not done yet***

## Other open source players


## Support

This library is actively supported by Rumble Studio who helps to create audio content. Check it out: [Rumble Studio](https://rumble.studio)

<img src="https://rumblestudio.app/assets/rs-logos/classic-reversed.svg">

