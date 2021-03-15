import {  RumblePlayer } from './player';

/*
describe('rumble player', () => {
  it('It should call play method and change playing status to true', () => {
    const rp = new RumblePlayer()
    // rp.connectedCallback()
    expect(rp.isPlaying).toEqual(false);
    rp.play()
    expect(rp.isPlaying).toEqual(true);
  });
});



describe('rumble player', () => {
  it('calling pause method while playing should change playing status to false', () => {
    const rp = new RumblePlayer()
    // rp.connectedCallback()
    rp.play()
    rp.pause()
    expect(rp.isPlaying).toEqual(false);
  });
});


describe('rumble player', () => {
  it('calling seek method while being pause should change seeking time and keep playing status to “false”', () => {

    const rp = new RumblePlayer()

    rp.play()
    rp.pause()
    const seekingTime = rp.getSeekingTime()
    rp.seek(4)
    expect(rp.isPlaying).toEqual(false);
    expect(rp.getSeekingTime()).toEqual(seekingTime);
  });
});
*/

describe('rumble player instance', () => {
  it('should create an empty player not playing', () => {
    const player = new RumblePlayer()
    expect(player).toBeDefined()
    expect(player.index).toEqual(-1);
    expect(player.getPlaylist()).toEqual([]);
    expect(player.isPlaying).toEqual(false);
  });
  it('should add the player to the DOM', () => {
    document.body.innerHTML =
    '<div> <span id=“username” /><button id=“button” /> </div>';
    const player = new RumblePlayer()
    document.body.appendChild(player)
    const playerID = 'rs-player'
    player.setAttribute('id', playerID)
    expect(document.getElementById('button')).toBeDefined()
    expect(document.getElementById(playerID)).toBeDefined()

  });
  it('should fill the player with a playlist', () => {
    const player = new RumblePlayer()
    const playlist = ['blabla','dkasfadfa','dafafafsdf','ismael','joris','rumble-studio']
    player.setPlaylist(playlist)
    expect(player.getPlaylist()).toEqual(playlist)
  });
  /*it('should be playing when when we click on play', () => {
    const player = new RumblePlayer()
    document.body.appendChild(player)
    player.play()



  });*/
  it('should create a button', () => {
    document.body.innerHTML =
      '<div> <span id=“username” /><button id=“button” /> </div>';
    const player = new RumblePlayer()
    document.body.appendChild(player)
    const playerID = 'rs-player'
    player.setAttribute('id', playerID)
    expect(document.getElementById('button')).toBeDefined()
    expect(document.getElementById(playerID)).toBeDefined()
    const playlist = ['blabla','dkasfadfa','dafafafsdf','ismael','joris','rumble-studio']
    player.setPlaylist(playlist)
    expect(player.getPlaylist()).toEqual(playlist)


  });

});
