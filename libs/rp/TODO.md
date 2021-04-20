# TODO

- create a method in playerService to add a song on demand 
  playerService.addSong(song:Song)

- depuis demo angular: ajouter un bouton pour appeler "playerService.addSong" with a new dummy song

- trouver un moyen pour que le visualChildren "simplePlaylist" et "multiLinearBar" restent up-to-date avec l'état de la playlist.

- show which song is being played in playlist (with "selected" suffixe and bold text)
- mettre à jour les songs de la playlist quand leurs états évoluent (avoid "undefined" on valid property)


- ajouter une option sur la multilinear bar pour remplir tous les song avant le song being played (et rempalcer le blanc par une couleur semi transparente)



-  improve multilinearbar poour respecter les durees de chaque song dans le rendu
-  add image to Song class
-  fill image proerty with rss feed
-  show image if any in playlist (100px \* 100px) sinon "[no image]"
-  composant simpleImage (show image of song of global index exactement comme Spotify)
-  remplacer dans playerHTML tous les noms mde fonction pour respecte le format "processEventXXXXXXX" par exemple "play()" devient "processEventPlay(event?:Event)" ou "processEventPlay(event?:CustomEvent)"
-  faire en sorte que la playlist puisse émettre un custom event "play" with "index to be played" qui sera processé par playerHTML avec en option le fait de stopper les autres (comme la multiLinearBar) et en option la possibilité de repartir de zéro (resetPosition)
   detail: { index, stopOthers:true, updateGlobalIndex:true, resetPosition:true },

-  FAIRE UNE NOTE: quel format de fichier RSS pour les podcasts ? .rss VS .html VS .xml (où mettre du style)
-  sur le playerService: setPLaylistFromRSSFeedURL
-  re-order playlist (drag and drop)




## archive code:

		/*div.onmousedown = (ev => {
      ev.preventDefault()
      const shiftY = ev.clientY - div.getBoundingClientRect().top;
      //console.log(shiftY,ev.clientY,div.getBoundingClientRect().top)
      // shiftY not needed, the thumb moves only horizontally

      div.addEventListener('mousemove', onMouseMove);
      div.addEventListener('mouseup', onMouseUp);

      function onMouseMove(event) {
        let newTop = event.clientY - shiftY - div.parentElement.getBoundingClientRect().top;
        console.log(newTop)

        // the pointer is out of slider => lock the thumb within the bounaries
        if (newTop < 0) {
          newTop = 0;
        }
        const bottomEdge = div.parentElement.offsetHeight - div.offsetHeight;
        if (newTop > bottomEdge) {
          newTop = bottomEdge;
        }

        div.style.top = newTop + 'px';
      }

      function onMouseUp() {
        div.removeEventListener('mouseup', onMouseUp);
        div.removeEventListener('mousemove', onMouseMove);
      }
    })*/