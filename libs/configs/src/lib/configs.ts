import { PlayerHTML } from '@rumble-player/player';
import { PlayerService } from '@rumble-player/service';
import { SimplePlayButton } from '@rumble-player/elements';
import { SimplePauseButton } from '@rumble-player/elements';
import { SimplePrevButton } from '@rumble-player/elements';
import { SimpleNextButton } from '@rumble-player/elements';
import { SimpleStopButton } from '@rumble-player/elements';
import { SimpleBackwardButton } from '@rumble-player/elements';
import { SimpleForwardButton } from '@rumble-player/elements';
import { LinearBar } from '@rumble-player/elements';
import { SimpleImage } from '@rumble-player/elements';
import { SimpleMultiLinearBar } from '@rumble-player/elements';

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
