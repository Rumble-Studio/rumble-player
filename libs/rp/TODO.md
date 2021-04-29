# TODO

## Todolist

-  quand la playlist est vide:

   -  mettre un message global "Playlist empty" -> visual child "SimpleInfoMessage"
   -  desactiver tous les boutons
   -  (ou que le fichier "being played" est incorrect) faire en sorte que les visual children de type "time" affiche "n.a" instead of -1.

-  fonction de la MLB: reset incorrect: blink behaviour à corriger
-  play should not reset the song (even if there is only one song)

-  la valeur par défaut du champ RSS feed doit valoir https://feeds.buzzsprout.com/159584.rss
-  un form angular doit TOUJOURS avoir un un formControl

-  le bouton "add song" ne fonctionne qu'une seule fois
-  quand on clique directement sur la multi linear bar comme toute premiere étape le seek ne se voit pas (meme s'il fonctionne)

## Code archive

${actualDuration===this.minDuration?'100px':String(Math.floor(
(100\*(actualDuration / this.minDuration))) +

```javascript
// TOUT CE CODE VA DANS UPDATE VISUAL
// OUI OUI: on calcule tout à chaque fois!!!!
// playlist -> updated
// multiLinearBar.updateVisual

// lister les song
// lister les durées
// le résultat: un array de durées  (EN SECONDE)
const durationsArray = [
	24.5, // 0
	950.2, // 1 [5s] 1%
	-1,
	3660.5,
	-2,
	-1,
	17,
];
// transformer ce array en sub linear sizes
// si c'est pas chargé ou avec erreur ou duree nulle: => duree = 1s
const minSize = 10;
const maxRatio = 100;
const currentMaxSize = durationsArray.some((d) => d > 0)
	? Math.max(durationsArray)
	: 5;
const maxSizeToUse =
	currentMaxSize > maxRatio * minSize ? maxRatio * minSize : currentMaxSize;
const durationsToUse = durationsArray
	.map((d) => (d <= 0 ? minSize : d))
	.map((d) => (d > maxSizeToUse ? maxSizeToUse : d));
let durationsToUse = [
	24,
	100,
	10,
	100, // 3eme
	10,
	10,
	17,
];
// => can be directly used as percentage value in width property
durationsToUse = durationsToUse / sum(durationsToUse); // normalization => like percentage

const cumulativeDurations = cumsum(durationsToUse); // last element should equal 1

// HoW TO SEEK ON CLICK?
// clicked at: 5% multi linear bar
// WHAT TO DO ?
// clicked at 50% * cumulativeDurations[-1]
// clicked at 135.5s
const computedDuration = clickedPercentage * cumulativeDurations[-1]; //the last factor should be one)
const indexToSeek = cumulativeDurations.find((d) => d > computedDuration); // = 3
const songComputedDuration = computedDuration - cumulativeDurations[index]; // = 1.5
const songPercentage = songComputedDuration / durationsToUse[index];
playerService.seekPerPercentage(indexToSeek, songPercentage);

// HOW TO SHOW CURRENT POSITION
// [------|------------------|------------|-------|---|----]
// [--------------25%
const indexBeingPlayed = 1;
const currentPosition = 27; // (s)
const virtualPosition =
	cumulativeDurations[indexBeingPlayed] +
	(currentPosition / durationsArray[indexBeingPlayed]) *
		durationsToUse[indexBeingPlayed];
const percentageToDisplayOnMultiLinearBar =
	virtualPosition / cumulativeDurations[-1];
```
