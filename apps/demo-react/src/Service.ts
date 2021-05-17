import { PlayerService, Song } from '@rumble-player/service';
import { BehaviorSubject } from 'rxjs';
import React from 'react';

export class Bridge {

  feedUrl =
    'https://firebasestorage.googleapis.com/v0/b/rumble-studio-alpha.appspot.com/o' +
    '/assets%2Faudio%2Fjingles%2Fuplifting%2FUplifting-1.mp3?alt=media&token=60b80935-4468-425a-9a1a-bf84d443d2e2';
  public player : PlayerService;
  public playlist: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([] as Song[])
  public index: BehaviorSubject<number> = new BehaviorSubject<number>(-1)
  public percentage: BehaviorSubject<number> = new BehaviorSubject(0)
  public position: BehaviorSubject<number> = new BehaviorSubject(0)
  public playing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public isShuffled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public isLooping: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  get loop(){
    return this.player.loop
  }
  set loop(value){
    this.player.loop = value
  }

  get shuffle(){
    return this.player.shuffle
  }
  set shuffle(value){
    this.player.shuffle = value
  }

  get volume(){
    return this.player.volume
  }
  set volume(value){
    this.player.volume = value
  }


  constructor() {
    this.player = new PlayerService()
    this.index.next(this.player.index);
    this.percentage.next(this.player.percentage)
    this.playing.next(this.player.isPlaying)
    this.playlist.next([])
    this.player.addNewOnCallback((event)=>{this.on(event)})
    this.setPlaylistFromUrls([this.feedUrl,this.feedUrl])
  }

  private on(event){
    switch (event.type) {
      case 'newPosition':
        this.position.next(this.player.position);
        this.percentage.next(this.player.percentage);
        break;
      case 'newPlaylist':
        this.playlist.next(this.player.playlist);
        break;
      case 'newIndex':
        this.index.next(this.player.index);
        break;
      case 'seek':
        this.position.next(this.player.position);
        this.percentage.next(this.player.percentage);
        break;
      case 'playError':
        this.playing.next(this.player.isPlaying)
        break;
      case 'loadError':
        this.playing.next(this.player.isPlaying)
        break;
      default:
        this.playing.next(this.player.isPlaying);
        this.index.next(this.player.index);
        this.position.next(this.player.position);
        this.percentage.next(this.player.percentage);
    }
  }


  play(index?:number){
    if(index !== undefined){
      this.player.play(index)
    } else {
      this.player.play()
    }
  }
  pause(options?: {index?: number, pauseOthers?: boolean}){
    if(options){
      this.player.pause()
    } else {
      this.player.pause()
    }
  }
  prev(){
    this.player.prev()
  }
  next(){
    this.player.next()
  }
  stop(index?:number){
    if(index !== undefined){
      this.player.stop(index)
    } else {
      this.player.stop()
    }
  }

  seekPerPercentage(percentage: number) {
    this.player.seekPerPercentage(percentage)
  }

  seekForJump(e: CustomEvent) {
    const { jump } = e.detail;
    const position = this.player.position;
    const newPosition = jump + position;
    this.player.seekPerPosition(newPosition);
  }

  setPlaylistFromUrls(urls: string[]) {
    this.player.setPlaylistFromUrls(urls)
  }

  setPLaylistFromRSSFeedURL(url: string) {
    this.player.setPLaylistFromRSSFeedURL(url)
  }

}
export const BR = new Bridge()
export const Service = React.createContext(BR)
export const ServiceConsumer = Service.Consumer
export default Service

export  function secondsToFormat(timestamp: number) {
  const hours = Math.floor(timestamp / 60 / 60);
  const minutes = Math.floor(timestamp / 60) - hours * 60;
  const seconds = timestamp % 60;

  const formatted =
    hours.toFixed(0).padStart(2, '0') +
    ':' +
    minutes.toFixed(0).padStart(2, '0') +
    ':' +
    seconds.toFixed(0).padStart(2, '0');

  return formatted;
}
