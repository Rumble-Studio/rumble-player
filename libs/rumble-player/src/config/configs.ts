import { PlayerHTML } from '../lib/PlayerHTML';
import { PlayerService } from '../lib/PlayerService';
import { SimplePlayButton } from '../lib/visuals/buttons/simplePlayButton';

export function defaultConfig(
	playerService: PlayerService,
	container: HTMLElement
) {
	const playerHTML = new PlayerHTML(playerService);
	playerHTML.setPlayerService(playerService);

	const simplePlayButton: SimplePlayButton = new SimplePlayButton();
	simplePlayButton.setPlayerHTML(playerHTML);

	const simplePauseButton...

	... to finish

	container.appendChild(playerHTML);
	container.appendChild(simplePlayButton);
}

export function customConfig(
	playerService: PlayerService,
	container: HTMLElement
) {
	const playerHTML = new PlayerHTML(playerService);
	playerHTML.setPlayerService(playerService);

	// EQUIVALENT DU SIMPLE PLAY BUTTON FROM SCRATCH
	const myButton = document.createElement('input');

	myButton.setAttribute('type', 'button');
	myButton.setAttribute('value', '(custom btn) submit');
	myButton.classList.add('myClassOfButton');
	playerHTML.addEventListener('play', () => {
		myButton.setAttribute('disabled', 'true');
	});
	playerHTML.addEventListener('pause', () => {
		myButton.removeAttribute('disabled');
	});
	myButton.addEventListener('click', () => {
		playerHTML.play({});
	});

	container.appendChild(playerHTML);
	container.appendChild(myButton);
}
