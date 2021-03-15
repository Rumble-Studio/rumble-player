import {  RumblePlayer } from './player';
import set = Reflect.set;
import { Simulate } from 'react-dom/test-utils';
import error = Simulate.error;

const playlist = ['song1','song2','song3',]
const songDurations = [120,650,2000,]

window.HTMLMediaElement.prototype.play = () => { return Promise.resolve() };
window.HTMLMediaElement.prototype.pause = () => { /* do nothing */ };

describe('Instanciation',()=>{
  it('should create an empty player not playing', () => {
    const player = new RumblePlayer()
    expect(player).toBeDefined()
    expect(player.index).toEqual(-1);
    expect(player.getPlaylist()).toEqual([]);
    expect(player.isPlaying).toEqual(false);
  });

  it('should add the player to the DOM', () => {
    // Adding dummy elements
    document.body.innerHTML =
      '<div> <span id=“username” /><button id=“button” /> </div>';

    // Instancing the player
    const player = new RumblePlayer()

    // Appending the player to the DOM
    document.body.appendChild(player)
    const playerID = 'rs-player'
    player.setAttribute('id', playerID)

    expect(document.getElementById('button')).toBeDefined()
    expect(document.getElementById(playerID)).toBeDefined()

  });

})

describe('Playing behaviors',()=>{

  it('should fill the player with a playlist', () => {
    const player = new RumblePlayer()
    player.setPlaylist(playlist)

    expect(player.getPlaylist()).toEqual(playlist)
  });

  it('should be playing when when we click on play', async () => {
    const player = new RumblePlayer()
    // Testing to play without a playlist
    await player.play();
    expect(player.isPlaying).toEqual(false)
    // Testing with a playlist

    player.setPlaylist(playlist)
    await player.play();
    expect(player.isPlaying).toEqual(true)

  });
  it('should stop playing when click on pause', async () => {
    const player = new RumblePlayer()

    player.setPlaylist(playlist)
    await player.play();
    expect(player.isPlaying).toEqual(true)
    setTimeout(()=>{
      player.pause();
      expect(player.isPlaying).toEqual(false)
    },3000)


  });
  it('should stop playing when click on stop', async () => {
    const player = new RumblePlayer()

    player.setPlaylist(playlist)
    await player.play();
    expect(player.isPlaying).toEqual(true)
    setTimeout(()=>{
      player.stop();
      expect(player.isPlaying).toEqual(false)
    },3000)
  });
})



it('should play next song automatically', () => {

});


describe('Seeking behaviors',()=>{
  it('should not change the playing status when seeking', async () => {
    const player = new RumblePlayer()

    player.setPlaylist(playlist)
    await player.play()
    expect(player.isPlaying).toEqual(true)
    player.seek(6)
    expect(player.isPlaying).toEqual(true)
    player.pause()
    expect(player.isPlaying).toEqual(false)
    player.seek(30)
    expect(player.isPlaying).toEqual(false)


    //
  })
  it('should change the position when seeking', async () => {
    const player = new RumblePlayer()

    player.setPlaylist(playlist)
    await player.play()
    player.pause()
    const timeSeek = player.getSeekingTime()
    expect(player.getSeekingTime()).toEqual(timeSeek)
    player.seek(40)
    expect(player.getSeekingTime()).toBeGreaterThan(timeSeek)
    //
  })
  it('should go to the end of the song if seeking time over song duration', () => {
    //
  })
})

