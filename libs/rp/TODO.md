# TODO


~~prendre du recul pour voir que c'est pas fini! Il y a pleins de petits bugs, pleins de edge case qui ne marche pas, l'affichage global n'est pas clair: le style de la playlist prend trop de place: RETIRE LE STYLE ! Je répète: RETIRE LE STYLE! Je veux une liste ordered (<ol>) avec des items (<li>) et pas des grands rectangles. On fera une custom playlist plus tard.~~


à faire pour la démo:
- mettre un style CSS sur les artworks de la playlist pour corriger la taille: width:100px, height: 100px et object fit en cover
- corriger/recoller la multilinearBar (découpée en morceau aujourd'hui) (ajouter overflow scroll horizontal)
~~- ajouter un song avec le boutton "add song" ne semble pas pre-loader le fichier~~ Si
~~- play un song ajouté entraine une erreur dans les logs~~
~~- faire en sorte que la simplePlaylist ne permette pas de jouer plusieurs morceaux ensemble (via les properties de l'event) (DEJA DEMANDé AUPARAVANT)~~
~~- ajouter un dummy song qui n'a pas d'image (pour montrer "[NO IMAGE]")~~
-  ajouter une option sur la multilinear bar pour "remplir" le progress de tous les song avant le song being played (et remplacer le blanc par une couleur semi transparente) : cela sera le behaviour par défaut.
~~- composant simpleImage: ajouter du margin et un petit titre "image of selected song:" et mettre une taille max aussi: 300px~~


-  remplacer dans playerHTML tous les noms de fonction pour respecte le format "processEventXXXXXXX" par exemple "play()" devient "processEventPlay(event?:Event)" ou "processEventPlay(event?:CustomEvent)"
-  faire en sorte que la playlist puisse émettre un custom event "play" with "index to be played" qui sera processé par playerHTML avec en option le fait de stopper les autres (comme la multiLinearBar) et en option la possibilité de repartir de zéro (resetPosition)
   detail: { index, stopOthers:true, updateGlobalIndex:true, resetPosition:true },


-  ##### AVOID DOUBLE SAME CSS
