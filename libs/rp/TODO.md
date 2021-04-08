# TODO

- verifier React with new code
- adapt the playerHTML so that a handle to the playerService is passed through all visual childrens
- add again the events on the player service (using callback list for state and foreach on each of them and setter in state to call it)
- disable simplePlayButton when playing (and equivalent behaviours on other simple buttons)
- adapt simplePlayButton to become configurable to call to play a specific index
- new components:
    - create a simplePlaylist visual
        - parameter: title (optional)
        - click on an item should play the item
    - simpleTimeLeft (position)
    - simpleTimeSpent (duration - position)
    - simpleTotalTime (duration)
    - multiLinearBar (oneDifferentColor per item in the playlist)
- NOTE à faire: quel format de fichier RSS pour les podcasts ? .rss VS .html VS .xml (où mettre du style)
- sur le playerService: setPLaylistFromRSSFeedURL
- re-order playlist (drag and drop)