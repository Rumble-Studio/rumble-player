export * from './lib/rp';
export * from './lib/playerService';
export * from './lib/GenericVisual';
export * from './lib/playerHTML';

//buttons
export * from './lib/visuals/buttons/simplePlayButton';
export * from './lib/visuals/buttons/simplePauseButton';
export * from './lib/visuals/buttons/simpleStopButton';
export * from './lib/visuals/buttons/simpleNextButton';
export * from './lib/visuals/buttons/simplePrevButton';
export * from './lib/visuals/buttons/simpleForwardButton';
export * from './lib/visuals/buttons/simpleBackwardButton';


export * from './lib/visuals/buttons/simpleConfigurableButton';
// linear
export * from './lib/visuals/linear/LinearBar';
// giraffe
export * from './lib/visuals/funky/GiraffeVisual';
export * from './lib/visuals/funky/MoucheVisual';

// config

import * as config1 from './config/layout1.json'
import * as config2 from './config/layout2.json'
import * as config3 from './config/layout3.json'
export const Config1 = config1
export const Config2 = config2
export const Config3 = config3
