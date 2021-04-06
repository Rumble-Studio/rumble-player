# TODO

- faire les simpleButton manquants (next, prev, etc...) (meme si configurableButton peut faire beaucoup de chose)
- notamment un button "forward" configurable en durée (constructor: jump=15) -> emettre un customEvent de Seek avec cette valeur (warning, verifier que le playerService arrive a gérer un seek au dela de la duree d'un Song) 15s valeur par défaut mais configurable

- trouver sous React pourquoi la méthode "connectedCallback()" n'est pas appelée (et empeche la LinearBar de fonctionner). Existe-il un moyen de mettre l'objet dans le DOM avec "<rumble-player></rumble-player>" sans passer par une ReactRef.custom?
Je t'invite à retourer dans le tutoriel de NX pour lib commune a react et angular

- DANS LA LIB: creer 2/3 fichiers de configuration differents (pas de style, pas de position, pas de froufrou, rien de visuel) qui liste les boutons et les éléments à afficher (par exemple: [simplePlayButton,LinearBar])
- Ensuite: pouvoir créer une instance de PlayerHTML en remplissant les visualChild avec une config: this.playerHTML.nativeElement.setFromConfig('default1');