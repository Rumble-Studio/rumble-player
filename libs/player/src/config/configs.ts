import { PlayerHTML } from '@rumble-player/dom';
import { PlayerService } from '@rumble-player/dom';
import { SimplePlayButton } from '../lib/visuals/buttons/simplePlayButton';
import { SimplePauseButton } from '../lib/visuals/buttons/simplePauseButton';
import { SimplePrevButton } from '../lib/visuals/buttons/simplePrevButton';
import { SimpleNextButton } from '../lib/visuals/buttons/simpleNextButton';
import { SimpleStopButton } from '../lib/visuals/buttons/simpleStopButton';
import { SimpleBackwardButton } from '../lib/visuals/buttons/simpleBackwardButton';
import { SimpleForwardButton } from '../lib/visuals/buttons/simpleForwardButton';
import { LinearBar } from '../lib/visuals/linear/LinearBar';
import { SimpleImage } from '../lib/visuals/SimpleImage';
import { SimpleMultiLinearBar } from '../lib/visuals/linear/SimpleMultiLinearBar';

export function defaultConfig(
	playerService: PlayerService,
	container: HTMLElement
) {
	const playerHTML = new PlayerHTML(playerService);
	playerHTML.setPlayerService(playerService);

  const linearBar: LinearBar = new LinearBar();
  linearBar.setPlayerHTML(playerHTML);

  const multiLinearBar: SimpleMultiLinearBar = new SimpleMultiLinearBar();
  multiLinearBar.setPlayerHTML(playerHTML);

	const simplePlayButton: SimplePlayButton = new SimplePlayButton();
	simplePlayButton.setPlayerHTML(playerHTML);

  const simpleImage: SimpleImage = new SimpleImage();
  simpleImage.setPlayerHTML(playerHTML);


  const simplePauseButton: SimplePauseButton = new SimplePauseButton();
  simplePauseButton.setPlayerHTML(playerHTML);

  const simpleStopButton= new SimpleStopButton();
  simpleStopButton.setPlayerHTML(playerHTML);

  const simplePrevButton = new SimplePrevButton();
  simplePrevButton.setPlayerHTML(playerHTML);

  const simpleNextButton = new SimpleNextButton();
  simpleNextButton.setPlayerHTML(playerHTML);

  const simpleBackwardButton = new SimpleBackwardButton();
  simpleBackwardButton.setPlayerHTML(playerHTML);


  const simpleForwardButton = new SimpleForwardButton();
  simpleForwardButton.setPlayerHTML(playerHTML);




	container.appendChild(playerHTML);
	container.appendChild(simplePlayButton);
	container.appendChild(simplePauseButton);
  container.appendChild(simpleStopButton);
  container.appendChild(simplePrevButton);
	container.appendChild(simpleNextButton);
	container.appendChild(simpleBackwardButton);
	container.appendChild(simpleForwardButton);
  container.appendChild(simpleImage);

  container.appendChild(linearBar);
  container.appendChild(multiLinearBar);
}

export function customConfig(
	playerService: PlayerService,
	container: HTMLElement) {
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
