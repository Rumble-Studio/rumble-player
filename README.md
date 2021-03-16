

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
<rs-player
  id="rs-player-id"
  title="My player"
  darkMode
  source="https://link.to.json or mp3"/>
```
Using js 

```html
<div id="rs-player-id"></div>
<script>
    let sound = new RSPlayer({
      source: ['sound.webm', 'sound.mp3'],
      darkMode: true,
      title: 'My Player',
      parentId: 'rs-player-id'
    });
    sound.play();
</script>
```

As a dependency using React:

in main.tsx or main.js:
````javascript
import '@rumble-player/rp'
````
in your component
```jsx
export default class MyComponent extends React.Component{
  render(){
  return(
        <rs-player config={
                    {source: ['sound.webm', 'sound.mp3'],
                     darkMode: true,
                     title: 'My Player',
                     }}
              onLoad={this._onLoadCallback()}
              onPlay={this._onPlayCallback()}
              onNext={this._onNextCallback()}
              onPrev={this._onPrevCallback()}
  
          />)
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
<rs-player
  id="rs-player-id"
  [title]="'My player'"
  [darkMode]="true"
  (onPlay)="onPlayCallback()"
  (onNext)="onNextCallback()"
  (onPrev)="onPrevCallback()"
  (onLoad)="onLoadCallback()"
  source="https://link.to.json or mp3"/>
```

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
