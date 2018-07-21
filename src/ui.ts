

import { content } from './content'
// import { isMobile, isChromeIOS } from './utils'
import { HereMap, Coords, MarkerMeta } from './map'

import * as io from 'socket.io-client'

const styles = require('./sass/main')


const VIEWS = {
  BTN_INFO: "btn-info",
  NOTIFICATION_CENTER: "notification-center",
  NOTIFICATION_CONTENT: "notification-content"
}

const SELECTORS = {
  BTN_INFO: ".btn-info",
  NOTIFICATION_CENTER: ".notification-center",
  NOTIFICATION_CONTENT: ".notification-content",
  LOADING: ".loading",
  SIDE_BAR_CONTAINER: ".side-bar-container",
  SIDE_BAR: ".side-bar",
  MAP_CONTAINER: ".map-container"
}

const AUDIO = {
  found: "FOUND_IT",
  sound: "SOUND"
}

const NAMESPACE: string = "/heremapsapi"

export interface ViewsListTypes {
  [index: string]: HTMLElement
}
export interface AudioSources {
  [index: string]: HTMLAudioElement
}

export interface MessageData {
  id: string,
  message: string,
  added: boolean
}

class Ui {

  viewsList: ViewsListTypes
  btnInfo: HTMLButtonElement
  notificationCenter: HTMLElement
  notificationEle: HTMLElement
  notificationQueue: Array<string>
  loadingEle: HTMLElement
  audioSources: AudioSources
  timer: number
  activeState: string
  notificationVisible: boolean

  messages: Array<MessageData>
  
  sideBarContainer: HTMLElement
  sideBar: HTMLElement
  
  mapContainer: HTMLDivElement
  hereMap: HereMap
  startingCoords: Coords

  constructor() {
    
    this.btnInfo = document.querySelector(SELECTORS.BTN_INFO)
    this.notificationCenter = document.querySelector(SELECTORS.NOTIFICATION_CENTER)
    this.notificationEle = document.querySelector(SELECTORS.NOTIFICATION_CONTENT)
    this.notificationQueue = new Array()
    this.loadingEle = document.querySelector(SELECTORS.LOADING)

    this.audioSources = {
      [AUDIO.found]: new Audio('/static/audio/foundit.mp4'),
      [AUDIO.sound]: new Audio('https://audio.code.org/win3.mp3')
    }

    this.sideBarContainer = document.querySelector(SELECTORS.SIDE_BAR_CONTAINER)
    this.sideBar = document.querySelector(SELECTORS.SIDE_BAR)
    this.mapContainer = document.querySelector(SELECTORS.MAP_CONTAINER)
    
    this.timer = 0
    this.notificationVisible = false
    
    this.messages = []
    this.startingCoords = content.LOCATION.IWERX

  }

  init() {
    this.hideNotification()
    this.toggleLoading(false)

    this.setupAudio()
    this.resetAudioSources()
    this.addEvents()

    this.setupMap()

    this.connectSocket()
    this.addInitialMessages()
  }

  addEvents() {
    
    this.btnInfo.addEventListener('click', () => {
      this.showInfo()
    })
    this.notificationCenter.addEventListener('click', () => {
      this.hideNotification()
    })

  }

  // Socket
  connectSocket() {
    let _this = this
    let socket = io.connect('http://' + document.domain + ':' + location.port + NAMESPACE)
    socket.on('connected', function(msg: object) {
      _this.showNotification(content.SOCKET_CONNECTION)
    })

    socket.on('marker', function (data: MarkerMeta) {
      _this.showNotification("Adding marker")
      let src = data.src == "" ? content.SVG.MARKER_AQUA : data.src
      _this.hereMap.addMarker(src,
        { lat: data.lat, lng: data.lng }, 
        data.center)
    })
    socket.on('add-message', function (data: MessageData) {
      data.added = false
      _this.messages.push(data)
      _this.updateMessageUI()
    })

  }

  addInitialMessages() {
    this.messages = content.INITIAL_MESSAGES
    this.updateMessageUI()
  }

  updateMessageUI() {
    
    for (let i = 0; i < this.messages.length; i++) {
      const element = this.messages[i];
      if (!element.added) {
        let ele = <HTMLLIElement>(document.createElement('li'))
        ele.id = element.id
        ele.innerText = element.message
        this.sideBar.appendChild<HTMLElement>(ele)
        element.added = true
      }
    }
    let height = this.sideBarContainer.scrollHeight
    this.sideBarContainer.scrollTo(0, height)
  }


  // Audio


  setupAudio() {
  }

  /**
     * Resets all audio sources.
     */
  resetAudioSources() {
    for (const item of Object.keys(this.audioSources)) {
      this.pauseAudio(item);
    }
  }
  /**
   * Plays a provided audio file.
   * @param audio The audio file to play.
   * @param loop Indicates if the audio file should loop.
   */
  playAudio(audio: string, loop = false, startTime = 0, endTime: number = undefined) {
    let audioElement = this.audioSources[audio];
    if (loop) {
      audioElement.loop = true;
    }
    if (!this.audioIsPlaying(audio)) {
      audioElement.currentTime = startTime;
      let playPromise = audioElement.play();

      if (endTime !== undefined) {
        const timeUpdate = (e: Event) => {
          if (audioElement.currentTime >= endTime) {
            audioElement.pause();
            audioElement.removeEventListener('timeupdate', timeUpdate);
          }
        };

        audioElement.addEventListener('timeupdate', timeUpdate);
      }

      if (playPromise !== undefined) {
        playPromise.catch((error: Error) => {
          console.log('Error in playAudio: ' + error);
        });
      }
    }
  }

  /**
   * Pauses an audio file.
   * @param audio The audio file to pause.
   */
  pauseAudio(audio: string) {
    this.audioSources[audio].pause();
    this.audioSources[audio].currentTime = 0;
  }

  /**
   * Checks if the provided audio file is currently playing.
   * @param audio The audio file to test against.
   * @returns true if the audio is playing, false if not.
   */
  audioIsPlaying(audio: string) {
    return !this.audioSources[audio].paused;
  }

  // Info

  showInfo() {
    // this.toggleLoading(true)
    // setTimeout(() => {
    //   this.showNotification(content.INFO)
    this.hereMap.addMarker(content.SVG.MARKER_PINK, content.LOCATION.KLAMM, true)
    
    //   this.toggleLoading(false)
    // }, 2000);
  }

  // no need to hide info, notification auto hide.
  hideInfo() {
  }

  // Notifications

  showNotification(message: string) {
    if (this.notificationEle.innerText.length != 0) {
      // queue up message
      this.notificationQueue.push(message)
      return
    }

    this.notificationEle.innerText = message
    this.notificationCenter.hidden = false
    // this.notificationCenter.animate(
    
    // todo animate

    let charLength = message.length > 10 ? message.length : 10
    let autoHide = (charLength / 15.0 + 1.0) * 1000
    console.log("Auto hidding notification after seconds:", autoHide)
    setTimeout(() => {
      this.hideNotification()
    }, autoHide);
  }

  hideNotification() {
    this.notificationCenter.hidden = true
    this.notificationEle.innerText = ""

    // todo animate

    if (this.notificationQueue.length > 0) {
      this.showNotification(this.notificationQueue.pop())
    }
  }

  toggleLoading(show: boolean) {
    this.loadingEle.hidden = !show;
  }

  setupMap() {
    this.hereMap = new HereMap(
        this.mapContainer, 
        content.HERE_KEY, 
        content.HERE_ID, 
        this.startingCoords)
    this.hereMap.initMap()
    // this.hereMap.addMarker(content.SVG.MARKER_AQUA, content.LOCATION.IWERX)
  }
}


export let ui = new Ui()


