# TODO

- afficher le titre de la playlist en haut de la playlist avec une balise h3
- faire une fonction dans le playerService qui loop sur la playlist pour pre-loader les howl (preloadPlaylist)
- improve multilinearbar poour respecter les durees de chaque song dans le rendu
- add image to Song class
- fill image proerty with rss feed
- show image if any in playlist (100px * 100px) sinon "[no image]"   
- composant simpleImage (show image of song of global index exactement comme Spotify)
- remplacer dans playerHTML tous les noms mde fonction pour respecte le format "processEventXXXXXXX" par exemple "play()" devient "processEventPlay(event?:Event)" ou "processEventPlay(event?:CustomEvent)"
- faire en sorte que la playlist puisse émettre un custom event "play" with "index to be played" qui sera processé par playerHTML avec en option le fait de stopper les autres (comme la multiLinearBar) et en option la possibilité de repartir de zéro (resetPosition)
				detail: { index, stopOthers:true, updateGlobalIndex:true, resetPosition:true },


-  FAIRE UNE NOTE: quel format de fichier RSS pour les podcasts ? .rss VS .html VS .xml (où mettre du style)
-  sur le playerService: setPLaylistFromRSSFeedURL
-  re-order playlist (drag and drop)
